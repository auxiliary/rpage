/*
 * A plugin for making Bootstrap's pagination more responsive
 * https://github.com/auxiliary/rpage   
 */

jQuery.fn.rPage = function () {
    var $this = $(this);
    for(var i = 0, max = $this.length; i < max; i++)
    {
    	new rPage($($this[i]));
    }

    function rPage($container)
    {
    	this.label = function()
    	{
    		var active_index = this.active_index;
    		var rp = this;
    		this.els.each(function(){
    			if (rp.isNextOrPrevLink($(this)) == false)
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
                element.hasClass('pagination-prev')
                || element.hasClass('pagination-next')
                || element.text() == "»"
                || element.text() == "«"
            );
    	}
    	
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
    		if (element.text() == "...")
    		{
    			return false;
    		}
    		return true;
    	}
    	
	    this.removeOne = function()
	    {
	    	var active_index = this.active_index;
	    	var farthest_index = $container.find("li").length - 1;
	    	
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
                            var rpageindex = candid_candidate.data("rpage-index");
			    			if (this.needsEtcSign(active_index, farthest_index - 1))
			    			{
			    				this.els.eq(farthest_index - 2).before("<li class='disabled removable'><span>...</span></li>");
			    			}
			    			else if (this.needsEtcSign(1, active_index))
			    			{
			    				this.els.eq(1).after("<li class='disabled removable'><span>...</span></li>");
                            }
                            else
                            {
                                this.elements[rpageindex].visible = false;
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
	    			if (el.css("display") == "none")
	    			{
	    				hasHiddenElement = true;
	    			}
	    			if (el.text() == "...")
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
	    	for (var i = 0; i < this.els.length; i++)
	    	{
	    		this.els.eq(i).css("display", "inline");
	    	}
            this.els.filter(".removable").remove();
            element_widths = 0;
            this.elements = Array();
	    }
	    
	    this.calculateWidth = function()
	    {
            if (element_widths != 1){
                element_widths = 1;
                var width = 0;
                for (var i = 0; i < this.els.length; i++)
                {
                    var $el = $(this.els[i]);
                    var elwidth = 0;
                    elwidth += $el.children("a").eq(0).outerWidth();
                    elwidth += $el.children("span").eq(0).outerWidth();
                    width += elwidth;
                    $el.data("rpage-index",i);
                    this.elements[i] = {"width":elwidth, "visible":true};
                }
                return width;
            } else {
                width = 0;
                for (i = 0; i < this.elements.length; ++i) {
                    if (this.elements[i].visible == true){
                        width += this.elements[i].width;
                    }
                }
                return width;
            }
	    }

        var element_widths = 0;
        this.elements = Array();
	    this.els = $container.find("li");
        this.active_index = this.els.filter(".active").index();
	    this.label();
	    this.makeResponsive();
	    
	    var resize_timer;
	    
        $(window).resize(
        	$.proxy(function()
        	{
        		clearTimeout(resize_timer);
        		resize_timer = setTimeout($.proxy(function(){this.makeResponsive()}, this), 100);
        	}, this)
        );
    }
};
