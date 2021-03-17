$("document").ready(function() {
    $(".slider").rangeslider();
});
$.fn.rangeslider = function(options) {
    this.each(function(i, elem){
        var obj = $(elem); // input element
        var defautValue = obj.attr("value");

        var slider_max  = (obj.attr("max"));
        var slider_min  = (obj.attr("min"));
        var slider_step = (obj.attr("step"));
        var slider_stop = (slider_max - slider_min) / slider_step;
        var step_percentage = 100 / slider_stop;

        console.log(step_percentage); 

        var color = "";
        var classlist = obj.attr("class").split(/\s+/);
        $.each(classlist, function(index, item) {
            if(item.startsWith('slider-')) {
                color = item;
            }
        });

        if(color == "") {
            color = "slider-blue";
        }

        if(slider_stop <= 30){
            var i;
            var dots = "";
            for (i = 1; i < slider_stop; i++){
                dots += "<div class='dot' id='"+ i +"' style='left:"+ step_percentage * i +"%;'></div>";
            }
        }
        else{
            var dots = "";
        }

        obj.wrap("<span class='slider " + color + "'></span>");
        obj.after("<span class='slider-container " + color + "'><span class='bar'><span></span>" + dots + "</span><span class='bar-btn'><span>0</span></span></span>");
        obj.attr("oninput", "updateSlider(this)");
        updateSlider(this);
        return obj;
    });
};


function updateSlider(passObj) {
    var obj = $(passObj);
    var value = obj.val();
    var min = obj.attr("min");
    var max = obj.attr("max");
    var range = Math.round(max - min);
    var percentage = Math.round((value - min) * 100 / range);
    var nextObj = obj.next();

    var btn = nextObj.find("span.bar-btn");
    
    if(value == min){
        nextObj.find("span.bar-btn").css("left", percentage + "%");
    }
    else if(value == max){
        nextObj.find("span.bar-btn").css("left", "calc(" + percentage + "% - " + btn.width() + "px");
    }
    else{
        nextObj.find("span.bar-btn").css("left", "calc(" + percentage + "% - " + btn.width()/2 + "px");
    }
    nextObj.find("span.bar > span").css("width", percentage + "%");
    nextObj.find("span.bar-btn > span").text(value);
};