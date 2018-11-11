{
    let button_id;    
    $('.ui.icon.delete.button').on('click', function(event){
        event.preventDefault();
        button_id = ($(this).attr('id'));
        $('.mini.modal').modal('show');
    })
    $('.delete_unit').on('click', ()=>{
        $.ajax({
            url: `/stanje/:${button_id}`,
            method: 'delete',
            data: {id:button_id},
            success: function(data){
                if (data==="OK") {
                    location.reload();
                }
            },
            error: function(xhr, status, error){
                // console.log(xhr);
                // console.log(status);
                if (error) {
                    alert('Objekat nije pronadjen!')
                }
            }
        })
    })
    
    
}