/*
 * A plugin for making Bootstrap's pagination more responsive
 * https://github.com/auxiliary/rpage
 */

(function ($){
    jQuery.fn.rPage = function () {
        var $this = $(this);
        for(var i = 0, max = $this.length; i < max; i++)
        {
        	new rPage($($this[i]));
        }

        function rPage($container)
        {
            // maybe user can pre-define this later
            this.nextprev_class = ["prev", "next"];
            this.nextprev_text = ["prev", "next", "»", "«"];
            this.dots_class = ["dots"];
            this.dots_text = ["..."];

        	this.label = function()
        	{
        		var active_index = this.els.filter(".active").index();
        		var rp = this;
        		this.els.each(function(){
                    //if (rp.isNextOrPrevLink($(this)) == false)
                    if (!rp.isNextOrPrevLink($(this)))
        			{
        				$(this).addClass("page-away-" + (Math.abs(active_index - $(this).index())).toString());
        			}
        			else
        			{
        				if ($(this).index() > active_index)
        				{
        					$(this).addClass("right-etc");
        				}
        				else
        				{
        					$(this).addClass("left-etc");
        				}
        			}
        		});
        	}

            this.compareText = function(text, str)
            {
                if (!text) return;

                var regex = new RegExp(
                        "("
                        + str
                            .join('@')
                            .replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
                            .replace(/@/g, "|")
                        + ")",
                        'gi'
                    );

                return text.match(regex);
            }

        	this.makeResponsive = function()
    	    {
    	    	this.reset();
    	    	var width = this.calculateWidth();

    	    	while (width > this.els.parent().parent().outerWidth() - 10)
    	    	{
    	    		var did_remove = this.removeOne();
    	    		if (did_remove == false)
    	    		{
    	    			break;
    	    		}
    	    		width = this.calculateWidth();
    	    	}
    	    }

            this.isNextOrPrevLink = function(element)
            {
                return (
                    this.compareText(element.attr("class"), this.nextprev_class)
                    || this.compareText(element.text(), this.nextprev_text)
                );
            }

        	/*
            this.isNextOrPrevLink = function(element)
        	{
                return (
                    //element.hasClass('pagination-prev')
                    //|| element.hasClass('pagination-next')
                    element.is("[class*='prev']")
                    || element.is("[class*='next']")
                    || element.text().trim() == "»"
                    || element.text().trim() == "«"
                );
        	}
            */

        	this.isRemovable = function(element)
        	{
        		if (this.isNextOrPrevLink(element))
        		{
        			return false;
        		}
        		var index = this.els.filter(element).index();
        		if (index == 1 || this.isNextOrPrevLink($container.find("li").eq(index + 1)))
        		{
        			return false;
        		}
                /*
                if (element.text().trim() == "...")
        		{
        			return false;
        		}
        		return true;
                */
                return !this.compareText(element.attr("class"), this.dots_class) && !this.compareText(element.text(), this.dots_text);
        	}

    	    this.removeOne = function()
    	    {
    	    	var active_index = this.els.filter(".active").index();
    	    	var farthest_index = $container.find("li").length - 1;
    	    	var next = active_index + 1;
    	    	var prev = active_index - 1;

    	    	for (var i = farthest_index - 1; i > 0; i--)
    	    	{
    	    		var candidates = this.els.filter(".page-away-" + i.toString());
    	    		var candidate = candidates.filter(function(){
    	    			return this.style["display"] != "none";
    	    		});
    	    		if (candidate.length > 0)
    	    		{
    	    			for (var j = 0; j < candidate.length; j++)
    	    			{
    	    				var candid_candidate = candidate.eq(j);
    	    				if (this.isRemovable(candid_candidate))
    		    			{
    			    			candid_candidate.css("display", "none");
    			    			if (this.needsEtcSign(active_index, farthest_index - 1))
    			    			{
    			    				this.els.eq(farthest_index - 2).before("<li class='disabled removable'><span>" + this.dots_text + "</span></li>");
    			    			}
    			    			if (this.needsEtcSign(1, active_index))
    			    			{
    			    				this.els.eq(1).after("<li class='disabled removable'><span>" + this.dots_text + "</span></li>");
    			    			}
    			    			return true;
    		    			}
    	    			}
    	    		}
    	    	}
    	    	return false;
    	    }

    	    this.needsEtcSign = function(el1_index, el2_index)
    	    {
    	    	if (el2_index - el1_index <= 1)
    	    	{
    	    		return false;
    	    	}
    	    	else
    	    	{
    	    		var hasEtcSign = false;
    	    		var hasHiddenElement = false;
    	    		for (var i = el1_index + 1; i < el2_index; i++)
    	    		{
    	    			var el = $container.find("li").eq(i);
    	    			//if (el.css("display") == "none")
                        if (el.is(':hidden'))
    	    			{
    	    				hasHiddenElement = true;
    	    			}
    	    			//if (el.text().trim() == "...")
                        if (this.compareText(el.attr("class"), this.dots_class) || this.compareText(el.text(), this.dots_text))
    	    			{
    	    				hasEtcSign = true;
    	    			}
    	    		}
    	    		if (hasHiddenElement == true && hasEtcSign == false)
    	    		{
    	    			return true;
    	    		}
    	    	}
    	    	return false;
    	    }

    	    this.reset = function()
    	    {
    	    	/*
                for (var i = 0; i < this.els.length; i++)
    	    	{
    	    		this.els.eq(i).css("display", "inline");
    	    	}
                $container.find("li").filter(".removable").remove();
                */
                $(this.els)
                    .css("display", "inline")
                    .filter(".removable")
                    .remove();
    	    }

    	    this.calculateWidth = function()
    	    {
    	    	return $container.outerWidth();
                /*
                var width = 0;
    	    	for (var i = 0; i < $container.find("li").length; i++)
    	    	{
              width += $container.find("li").eq(i).children("a").length
                && $container.find("li").eq(i).children("a").eq(0).outerWidth();
              width += $container.find("li").eq(i).children("span").length
                && $container.find("li").eq(i).children("span").eq(0).outerWidth();
    	    	}
    	    	return width;
                */
    	    }

    	    this.els = $container.find("li");
    	    this.label();
    	    this.makeResponsive();

    	    //var resize_timer;

            $(window).resize(
            	$.proxy(function()
            	{
                    // realtime, to avoid delay
                    this.makeResponsive();
                    /*
            		clearTimeout(resize_timer);
            		resize_timer = setTimeout($.proxy(function(){this.makeResponsive()}, this), 100);
                    */
            	}, this)
            );
        }
    };
}(jQuery));
