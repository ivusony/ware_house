module.exports = {
    date: function(){
            let today   = new Date(),
                dd      = today.getDate(),
                mm      = today.getMonth()+1, //January is 0!
                yyyy    = today.getFullYear(),
                h       = today.getHours(),
                m       = today.getMinutes();
        
            if(dd<10) {
                dd = '0'+dd
            } 
        
            if(mm<10) {
                mm = '0'+mm
            } 
        
            if (h<10) {
                h = '0'+h
            }
        
            if (m<10) {
                h = '0'+m
            }
        
            today = `${dd}/${mm}/${yyyy}   ${h}:${m}`
            return today
        }
}