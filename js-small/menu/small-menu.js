small.extendMethods({
    menu: function(fileName){
        small.json({
            "url": fileName,
            "callback": function(response){
                if(response.length > 0){
                    var container = this.first();

                }
            }
        });
        function render(list, parent){
            //должен возвращать флаг, если дети
            //на parent=null должен формировать меню иначе подменю (никаких suber)
            //формировать менб списками как было
        }
    }
});