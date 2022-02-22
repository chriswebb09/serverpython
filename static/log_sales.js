const url_element = "https://icones.pro/wp-content/uploads/2021/08/icone-x-noir.png";

function addSaleItem(sale) {
    var divOpen = "<div class='sale-item row'><div class='entry-text col-sm-3 text-left' id=" + sale.sales_id + ">";
    var internalDiv = "</div><div class='entry-text col-sm-4 text-left'>";
    var internalDiv2 = "</div><div class='entry-text col-sm-1'>";
    $('#sale-list').append(divOpen + sale.salesperson + internalDiv + sale.client + internalDiv2 + sale.reams + "</div><div class='col-sm-2'></div><div class='col-sm-1'><button type='button' class='delete-button btn btn-warning'><img src='" + url_element + "' width='20'/></button></div></div>");
}
 //+ sale["sales_id"] + 
function updateSales(data) {
    $('#sale-list').empty();
    $.each(data, function(sale) {
        addSaleItem(sale);
    });
}

function isEmpty(str) {
    return (!str || str.length === 0 );
}

function clearEntry() {
    $('#client-text-form').val("");  
    $('#reams-text-form').val("");
}

function show() {
    var listHeader = document.getElementById("sale-list-header");
    if (listHeader.style.display === "none") {
        listHeader.style.display = "";
    }
}

function hide() {
    var listHeader = document.getElementById("sale-list-header");
    listHeader.style.display = "none";
}

function save_new_sale() {
    var client = $('#client-text-form').val();
    var reams = $('#reams-text-form').val();

    if (isEmpty(client)) {
        alert("You must enter a client name.");
        document.getElementById("client-text-form").focus();
        return;
    }

    if (isEmpty(reams)) {
        alert("You must enter a value");
        document.getElementById("reams-text-form").focus();
        return;
    }

    if (isNaN(parseInt(reams))) {
        alert("Entry must be a number");
        document.getElementById("reams-text-form").focus();
        return;
    }

    var data_to_save = {
        "client": client,
        "reams": reams,
        "salesperson": "temp"
    };
    var dataToSave = [];
    dataToSave.push(data_to_save);
    var jsonStringified = JSON.stringify(dataToSave);
    $.ajax({
        type: "POST",
        url: "add_sale",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : jsonStringified,
        success: function(result) {
            var all_data = result.data;
            data = all_data;
            updateSales(data[0]);
            show();
            $('#client-text-form').autocomplete({
                source: data[1]
            });
            clearEntry();
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });
}

function delete_sale(id) {
    var data_to_save = {
        "id": id 
     };
     
     var dataToSave = [];
     dataToSave.push(data_to_save);
     var jsonStringified = JSON.stringify(dataToSave);

     $.ajax({
        type: "POST",
        url: "delete",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : jsonStringified,
        success: function(result) {
            var all_data = result.data;
            data = all_data;
            updateSales(data[0]);
            $('#client-text-form').autocomplete({
                source: data[1]
            });

            if (data[0] === undefined || data[0].length == 0) {
                hide();
            }
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });
}

$(document).ready(function(){
    var clients = data[1];
    //when the page loads, display all the names
    updateSales(data[0]);

    $('#client-text-form').autocomplete({
        source: clients
    });

    $("#submit_sale").click(function(){                
        save_new_sale();
    });

    $("#reams-text-form").keypress(function(e){     
        if(e.which == 13) {
            save_new_sale();
        }   
    });

    $(document).on("click", ".delete-button", function() {
         var parent = $(this).parent().parent();
         var entryText = $(parent).find('.entry-text');
         var id = entryText[0].id;
         delete_sale(id);
    });
});