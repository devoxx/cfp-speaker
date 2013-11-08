
function AnimController() {

    var MAX = 2;

    var anims = [
        new Anim(5, "#spacecraft"),
        new Anim(16*2, "#twitter-whale"),
        //new Anim(25, "#twitter-birds"), - do them all the time
        new Anim(10*2, "#android-sat"),
        new Anim(8, "#airplane-smoke")
    ];

    var animRunning = [];

    /**
     * @param time animation duration in seconds (x2 for alternating animations)
     * @param selector jQuery selector to add/remove class
     */
    function Anim(time, selector) {

        var self = this;

        this.time = time;
        this.selector = selector;

        this.start = function() {
            animRunning.push(this);
            $(selector).addClass("anim");
            setTimeout(self.stop, self.time * 1000)
        }


        this.stop = function() {
            var index = animRunning.indexOf(self);
            if (index == -1) {
                console.error("Can't stop animation, not running!? - " + self);
            } else {
                animRunning.splice(index, 1);
                $(selector).removeClass("anim")
            }
        }

        this.isRunning = function() {
            var index = animRunning.indexOf(self);
            return index != -1;
        }

        this.toString = function() {
            return "Anim(" + self.selector + ")";
        }

    }

    function doRandomAnim() {

        if (animRunning.length < MAX) {

            var index = nextIndex();
            var anim = anims[index];
            if (!anim.isRunning()) {
                anim.start();
            }

            function nextIndex() {
                return Math.round(Math.random() * (anims.length - 1));
            }

        }

    }

    setInterval(doRandomAnim, 10000);
}



