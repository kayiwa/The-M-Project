Addressbook = M.Application.extend({

    start: function() {

        if(this.runtime === 'browser'){
            M.LayoutManager.setLayout(new M.Layout()).setContent({
                view: Addressbook.Main
            });
        }


        Addressbook.ApplicationController.init();
    }
});