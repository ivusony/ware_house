{
    let uid;
    $(document).ready(function(){
       
        $.ajax({
            url: '/stanje/welcome',
            method: 'GET',
            success: function(data){
                uid=data._id;
                if (data.showWelcome) {
                    $('#username').text(data.username);
                    $('#welcome_modal')
                    .modal('setting', 'closable', false)
                    .modal('show');
                }
                console.log(data)
            }
        })
    })

    $('#unshowWelcome').on('click', function(){
        $.ajax({
            url: "/stanje/welcome",
            method: 'POST',
            data: {
                id:uid
            },
            success: function(data){
                console.log(data)
            }
        })
        console.log(uid)
    })
    
}