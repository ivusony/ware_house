$('#search_items').on('keyup', function(){
  
        var val = $.trim($('#search_items').val());
        var srcby = $('.dropdown option:selected').val();

        if (val==='') {
          $('.results').empty();
          return
        }else{
              $.ajax({
                  url: "/search",
                  type: "POST",
                  data: {value: val, srcby: srcby},
                  dataContent: "application/json",
                  success: function(data) {
                    if (data === undefined) {
                        console.log(`Empty`);
                    }else{
                      if (val==='') {
                        $('.results').empty();
                      }else{
                        $('.results').empty();
                        let str = searchresultstring(data);
                        str.forEach(el=>{
                          $('.results').append('<p>' + el + '</p>') 
                        })
                      }
                    }
                  },
                  error: function(err){
                    $('.results').empty();
                    $('.results').prepend('<p id="dummyresult">Nema unosa pod zadatim kriterijumima pretrage</p>');
                  }
                })
              }
  
    function searchresultstring(data){
      let str = [];
      data.forEach(element => {
        str.push('<a href="/stanje/'+element._id+'">' + 'Sifra: ' +element.code + ' Naziv: ' +element.name+'</a>')
      });

      return str
    }
})



$(document).on('click', function(){
  

})