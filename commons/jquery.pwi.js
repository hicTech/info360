/**
 * OK
 * 
 * Picasa Webalbum Integration jQuery plugin
 * This library was inspired aon pwa by Dieter Raber
 * @name jquery.pwi.js
 * @author Jeroen Diderik - http://www.jdee.nl/
 * @revision 1.3.0
 * @date august 16, 2010
 * @copyright (c) 2010 Jeroen Diderik(www.jdee.nl)
 * @license Creative Commons Attribution-Share Alike 3.0 Netherlands License - http://creativecommons.org/licenses/by-sa/3.0/nl/
 * @Visit http://pwi.googlecode.com/ for more informations, duscussions etc about this library
 */

(function ($) {
    var elem, opts = {};
    $.fn.pwi = function (opts) {
        var $self, settings = {};
        opts = $.extend({}, $.fn.pwi.defaults, opts);
        elem = this;
        function _initialize() {
            settings = opts;
            ts = new Date().getTime();
            settings.id = ts;
            $self = $("<div id='pwi_" + ts + "'/>").appendTo(elem);
            $self.addClass('pwi_container');
            _start();
            return false;
        }
        function _start() {
            if (settings.username === '') {
                alert('Make sure you specify at least your username.' + '\n' + 'See http://pwi.googlecode.com for more info');
                return;
            }
            switch (settings.mode) {
                case 'latest':
                    getLatest();
                    break;
                
                //--new cases by hicTech    
                case 'hicSlideshow':
                    getHicSlideshow();
                    break;
                
                 case 'appMLcarousel':
                    getAppMLcarousel();
                    break;
                    
                case 'products':
                    getProducts();
                    break;
                
                case 'brands':
                    getBrands();
                    break;
                
                 case 'albumsWithLocalStorageCache':
                    getAlbumsWithLocalStorageCache();   //it caches just the url
                    break;
                    
                  case 'albumsWithLazyLoad':
                    getAlbumsWithLazyLoad();
                    break;
                
                //--
                    
                case 'album':
                    getAlbum();
                    break;
                case 'keyword':
                    getAlbum();
                    break;
                default:
                    getAlbums();
                    break;
            }
            
        }
        
       
        function formatDate($dt) {
            var $today = new Date(Number($dt)),
			$year = $today.getUTCFullYear();
            if ($year < 1000) {
                $year += 1900;
            }
            return (settings.months[($today.getUTCMonth())] + " " + $today.getUTCDate() + ", " + $year);
        }
        function nl2br(s) {
            return s.replace(/\n/g, '<br />\n');
        }
        function formatDateTime($dt) {
            var $today = new Date(Number($dt));
            $year = $today.getUTCFullYear();
            if ($year < 1000) {
                $year += 1900;
            }
            if ($today == "Invalid Date") {
                return $dt;
            } else {
                return ($today.getUTCDate() + "-" + ($today.getUTCMonth() + 1) + "-" + $year + " " + $today.getUTCHours() + ":" + ($today.getUTCMinutes() < 10 ? "0" + $today.getUTCMinutes() : $today.getUTCMinutes()));
            }
        }

        function photo(j) {
            var $html, $d = "", $c = "", $img_base = j.content.src,
				$id_base = j.gphoto$id.$t;
            $c = nl2br(j.summary ? j.summary.$t : "");
            if (settings.showPhotoDate) {
                if (j.exif$tags.exif$time) {
                    $d = formatDateTime(j.exif$tags.exif$time.$t);
                } else if (j.gphoto$timestamp) {
                    $d = formatDateTime(j.gphoto$timestamp.$t);
                } else {
                    $d = formatDateTime(j.published.$t);
                }
                $d += " ";
            }
            $d += $c.replace(new RegExp("'", "g"), "&#39;");
            $html = $("<div class='pwi_photo' style='height:" + (settings.thumbSize + 1) + "px;cursor: pointer;'/>");
			$html.append("<a href='" + $img_base + "?imgmax=" + settings.photoSize + "' rel='lb-" + settings.username + "' title='" + $d + "'><img src='" + $img_base + "?imgmax=" + settings.thumbSize + "&crop=" + settings.thumbCrop + "'/></a>"); 
            //if(settings.showPhotoDownload){$c += "download";}
            if (settings.showPhotoCaption) {
                if (settings.showPhotoCaptionDate && settings.showPhotoDate) { $c = $d; }
                if ($c > settings.showCaptionLength) { $c = $c.substring(0, settings.showCaptionLength); }
                $html.find("a").append("<br/>" + $c);
            }
            if (typeof (settings.onclickThumb) === "function") { var obj = j; $html.bind('click.pwi', obj, clickThumb); }

            return $html;

        }
        
        //-- new by hictech
        
        
        function slide(j) {
            var $html, $d = "", $c = "", $img_base = j.content.src,
				$id_base = j.gphoto$id.$t;
            $c = nl2br(j.summary ? j.summary.$t : "");
            if (settings.showPhotoDate) {
                if (j.exif$tags.exif$time) {
                    $d = formatDateTime(j.exif$tags.exif$time.$t);
                } else if (j.gphoto$timestamp) {
                    $d = formatDateTime(j.gphoto$timestamp.$t);
                } else {
                    $d = formatDateTime(j.published.$t);
                }
                $d += " ";
            }
            $d += $c.replace(new RegExp("'", "g"), "&#39;");
            $html = $("<div class='pwi_slide' style='height:" + (settings.thumbSize + 1) + "px'/>");
			$html.append("<a href='" + $img_base + "?imgmax=" + settings.photoSize + "' rel='lb-" + settings.username + "' title='" + $d + "'><img src='" + $img_base + "?imgmax=" + settings.thumbSize + "&crop=" + settings.thumbCrop + "'/></a>"); 
            //if(settings.showPhotoDownload){$c += "download";}
            if (settings.showPhotoCaption) {
                if (settings.showPhotoCaptionDate && settings.showPhotoDate) { $c = $d; }
                if ($c > settings.showCaptionLength) { $c = $c.substring(0, settings.showCaptionLength); }
                $html.find("a").append("<br/>" + $c);
            }
            if (typeof (settings.onclickThumb) === "function") { var obj = j; $html.bind('click.pwi', obj, clickThumb); }

            return $html;

        }
        
        
                
        function brand(j) {
            var $html, $d = "", $c = "", $img_base = j.content.src,
				$id_base = j.gphoto$id.$t;
            $c = nl2br(j.summary ? j.summary.$t : "");
            if (settings.showPhotoDate) {
                if (j.exif$tags.exif$time) {
                    $d = formatDateTime(j.exif$tags.exif$time.$t);
                } else if (j.gphoto$timestamp) {
                    $d = formatDateTime(j.gphoto$timestamp.$t);
                } else {
                    $d = formatDateTime(j.published.$t);
                }
                $d += " ";
            }
            $d += $c.replace(new RegExp("'", "g"), "&#39;");
            $html = $("<div class='' style='height:" + (settings.thumbSize + 1) + "px; margin:10px 0px 0px 65px'/>");
			$html.append("<a  href='" + $img_base + "?imgmax=" + settings.photoSize + "' rel='lb-" + settings.username + "' title='" + $d + "'><img style='border:none' src='" + $img_base + "?imgmax=" + settings.thumbSize + "&crop=" + settings.thumbCrop + "'/></a>"); 
            //if(settings.showPhotoDownload){$c += "download";}
            if (settings.showPhotoCaption) {
                if (settings.showPhotoCaptionDate && settings.showPhotoDate) { $c = $d; }
                if ($c > settings.showCaptionLength) { $c = $c.substring(0, settings.showCaptionLength); }
                $html.find("a").append("<br/>" + $c);
            }
            if (typeof (settings.onclickThumb) === "function") { var obj = j; $html.bind('click.pwi', obj, clickThumb); }

            return $html;

        }
        
        
        
        function carouserlLi(j) {
            var $html, $d = "", $c = "", $img_base = j.content.src,
				$id_base = j.gphoto$id.$t;
            $c = nl2br(j.summary ? j.summary.$t : "");
            if (settings.showPhotoDate) {
                if (j.exif$tags.exif$time) {
                    $d = formatDateTime(j.exif$tags.exif$time.$t);
                } else if (j.gphoto$timestamp) {
                    $d = formatDateTime(j.gphoto$timestamp.$t);
                } else {
                    $d = formatDateTime(j.published.$t);
                }
                $d += " ";
            }
            $d += $c.replace(new RegExp("'", "g"), "&#39;");
            $html = $("<li class='' style='height:" + (settings.thumbSize + 1) + "px'/>");
			$html.append("<img style='border:none' src='" + $img_base + "?imgmax=" + settings.thumbSize + "&crop=" + settings.thumbCrop + "'/>"); 
            //if(settings.showPhotoDownload){$c += "download";}
            if (settings.showPhotoCaption) {
                if (settings.showPhotoCaptionDate && settings.showPhotoDate) { $c = $d; }
                if ($c > settings.showCaptionLength) { $c = $c.substring(0, settings.showCaptionLength); }
                //$html.find("a").append("<br/>" + $c);
            }
            if (typeof (settings.onclickThumb) === "function") { var obj = j; $html.bind('click.pwi', obj, clickThumb); }

            return $html;

        }
        
        
        function products(j) {
            var $scAlbums = $("<div/>"), i = 0;
            var $na = 0, $navrow = "";
            i = settings.albumsPerPage * (settings.albumPage - 1);
            $na = j.feed.entry.length;
           
            
            while (i < settings.albumMaxResults && i < $na && i < (settings.albumsPerPage * settings.albumPage)) {
                var $id_base = j.feed.entry[i].gphoto$name.$t,
				$album_date = formatDate(j.feed.entry[i].gphoto$timestamp.$t),
				$thumb = j.feed.entry[i].media$group.media$thumbnail[0].url.replace(new RegExp("/s160-c/", "g"), "/");
				
                if ($.inArray($id_base, settings.albums) > -1 || settings.albums.length === 0) {
                    $scAlbum = $("<div class='pwi_album'/>");
                    var jfeed = j.feed.entry[i];
                    $scAlbum.bind('click.pwi', jfeed, function (e) {
                        e.stopPropagation();
                        settings.page = 1;
                        settings.album = e.data.gphoto$name.$t;
                        if (typeof (settings.onclickAlbumThumb) === "function") {
                            settings.onclickAlbumThumb(e);
                            return false;
                        } else {
                            getProduct();
                            return false;
                        }
                    });
                    
                    if(j.feed.entry[i].title.$t.indexOf(settings.hicSettings.productsSubStrIdentifier)!=-1){
                    	
                    	
	                    if (settings.showAlbumThumbs) {
	                    	var tit=j.feed.entry[i].title.$t.replace(settings.hicSettings.productsSubStrIdentifier,"")
	                        $scAlbum.append("<div class='product_thumb'><div class='title'>" + tronca(tit,19) +"</div><div ><img  src='" + $thumb + "?imgmax=" + settings.albumThumbSize + "&crop=" + settings.albumCrop + "'/></div></div>");
	                    }
	                   
	                    //$scAlbum.append("<br/>" + (settings.showAlbumdate ? $album_date : "") + (settings.showAlbumPhotoCount ? "&nbsp;&nbsp;&nbsp;&nbsp;" + j.feed.entry[i].gphoto$numphotos.$t + " " + settings.labels.photos : ""));
	                    
	                    $scAlbums.append($scAlbum);	
                    	
                    }
                    	
                }
                i++;
            }
            $scAlbums.addClass("productsContainer")
            $scAlbums.append("<div style='clear: both;height:0px;'/>");
            settings.albumstore = j;
            show(false, $scAlbums);
        }
        
        function product(j) {
            var $scPhotos, $scPhotosDesc, tmp = "",
			$np = j.feed.openSearch$totalResults.$t,
			$at = "", $navRow = "",
			$loc = j.feed.gphoto$location === undefined ? "" : j.feed.gphoto$location.$t,
			$ad = j.feed.subtitle === undefined ? "" : j.feed.subtitle.$t,
			$album_date = formatDate(j.feed.gphoto$timestamp === undefined ? '' : j.feed.gphoto$timestamp.$t),
			$item_plural = ($np == "1") ? false : true;

            $at = (j.feed.title === "undefined" || settings.albumTitle.length > 0) ? settings.albumTitle : j.feed.title.$t;
            $scPhotos = $("<div/>");
            if (settings.mode != 'album' && settings.mode != 'keyword') {
                tmp = $("<div class='product_header'><div class='pwi_product_backlink'>" + settings.labels.albums + "</div><div class='pwi_product_title'>" + tronca($at.replace(settings.hicSettings.productsSubStrIdentifier,""),60) + "</div></div>").bind('click.pwi', function (e) {
                    e.stopPropagation();
                    getProducts();
                    return false;
                });
                $scPhotos.append(tmp);
            }
            if (settings.showAlbumDescription) {
                $scPhotosDesc = $("<div class='pwi_product_description'/>");
                $scPhotosDesc.append("<div class='description'>" + $ad + "</div>");
                $scPhotos.append($scPhotosDesc);
            }

            if ($np > settings.maxResults) {
                $pageCount = ($np / settings.maxResults);
                var $ppage = $("<div class='pwi_prevpage'/>").text(settings.labels.prev),
				$npage = $("<div class='pwi_nextpage'/>").text(settings.labels.next);
                $navRow = $("<div class='pwi_pager'/>");
                if (settings.page > 1) {
                    $ppage.addClass('link').bind('click.pwi', function (e) {
                        e.stopPropagation();
                        
                        settings.page = (parseInt(settings.page, 10) - 1);
                        getAlbum();
                        return false;
                    });
                }
                $navRow.append($ppage);
                for (var p = 1; p < $pageCount + 1; p++) {
                    if (p == settings.page) {
                        tmp = "<div class='pwi_pager_current'>" + p + "</div> ";
                    } else {
                        tmp = $("<div class='pwi_pager_page'>" + p + "</div>").bind('click.pwi', p, function (e) {
                            e.stopPropagation();
                            settings.page = e.data;
                            getAlbum();
                            return false;
                        });
                    }
                    $navRow.append(tmp);
                }
                if (settings.page < $pageCount) {
                    $npage.addClass('link').bind('click.pwi', function (e) {
                        e.stopPropagation();
                        settings.page = (parseInt(settings.page,10) + 1);
                        getAlbum();
                        return false;
                    });
                }
                $navRow.append($npage);
                $navRow.append("<div style='clear: both;height:0px;'/>");
            }

            if ($navRow.length > 0 && (settings.showPager === 'both' || settings.showPager === 'top')) {
                $scPhotos.append($navRow);
            }

            var i = ((settings.page - 1) * settings.maxResults);

            while (i < (settings.maxResults * settings.page) && i < $np) {
                var $scPhoto = productPhotos(j.feed.entry[i]);
                $scPhotos.append($scPhoto);
                i++;
            }

            if ($navRow.length > 0 && (settings.showPager === 'both' || settings.showPager === 'bottom')) {
                $scPhotos.append($navRow.clone(true));
            }

            settings.photostore[settings.album] = j;
            var $s = $(".pwi_product_photo", $scPhotos).css(settings.thumbCss);
            if (typeof (settings.popupExt) === "function") {
                settings.popupExt($s.find("a[rel='lb-" + settings.username + "']"));
            } else if (typeof (settings.onclickThumb) != "function" && $.slimbox) {
                $s.find("a[rel='lb-" + settings.username + "']").slimbox(settings.slimbox_config);
               
            }
            $scPhotos.addClass("productPhotosContainer");
            
            
            
            show(false, $scPhotos);
        }
        
        
        
        function productPhotos(j) {
            var $html, $d = "", $c = "", $img_base = j.content.src,
				$id_base = j.gphoto$id.$t;
            $c = nl2br(j.summary ? j.summary.$t : "");
            if (settings.showPhotoDate) {
                if (j.exif$tags.exif$time) {
                    $d = formatDateTime(j.exif$tags.exif$time.$t);
                } else if (j.gphoto$timestamp) {
                    $d = formatDateTime(j.gphoto$timestamp.$t);
                } else {
                    $d = formatDateTime(j.published.$t);
                }
                $d += " ";
            }
            $d += $c.replace(new RegExp("'", "g"), "&#39;");
            $html = $("<div class='pwi_product_photo' style='height:" + (settings.thumbSize + 1) + "px;cursor: pointer;'/>");
			$html.append("<a href='" + $img_base + "?imgmax=" + settings.photoSize + "' rel='lb-" + settings.username + "' title='" + $d + "'><img style='border:none' src='" + $img_base + "?imgmax=" + settings.thumbSize + "&crop=" + settings.thumbCrop + "'/></a>"); 
            //if(settings.showPhotoDownload){$c += "download";}
            if (settings.showPhotoCaption) {
                if (settings.showPhotoCaptionDate && settings.showPhotoDate) { $c = $d; }
                if ($c > settings.showCaptionLength) { $c = $c.substring(0, settings.showCaptionLength); }
                $html.find("a").append("<br/>" + $c);
            }
            if (typeof (settings.onclickThumb) === "function") { var obj = j; $html.bind('click.pwi', obj, clickThumb); }

            return $html;

        }
        
        
        function albumsWithLocalStorage(j) {
        	var img_src;
            var $scAlbums = $("<div/>");
            var $na = 0, $navrow = "";
            i = settings.albumsPerPage * (settings.albumPage - 1);
            $na = j.feed.entry.length;
 			
 			
 			
            for (var i=0 ; i < $na ; i++) {
            	
                var $id_base = j.feed.entry[i].gphoto$name.$t,
				$album_date = formatDate(j.feed.entry[i].gphoto$timestamp.$t),
				$thumb = j.feed.entry[i].media$group.media$thumbnail[0].url.replace(new RegExp("/s160-c/", "g"), "/");
				
				
                if ($.inArray($id_base, settings.albums) > -1 || settings.albums.length === 0) {
                    $scAlbum = $("<div class='pwi_album'/>");
                    var jfeed = j.feed.entry[i];
                    
                    // this verify the presence of this resources in local storage
                    // NOTE: this cache system stores just the picas URL and NOT the image
                    var time5=new Date(); time5=time5.getTime();
                    if(DBget($id_base)==null){
                    	
                    	
                    	
						
                    	$scAlbum.bind('click.pwi', jfeed, function (e) {
                    	
	                        e.stopPropagation();
	                        settings.page = 1;
	                        settings.album = e.data.gphoto$name.$t;
	                        if (typeof (settings.onclickAlbumThumb) === "function") {
	                            settings.onclickAlbumThumb(e);
	                            return false;
	                        } else {
	                            getAlbum();
	                            return false;
	                        }
	                    });
	                    
	                    if (settings.showAlbumThumbs) {
	                    	
	                    	img_src=$thumb + "?imgmax=" + settings.albumThumbSize + "&crop=" + settings.albumCrop;
	                        $scAlbum.html("<img src='" + img_src + "'/>");
	                       
	                    }
	                    if (settings.showAlbumTitles) {
	                        $scAlbum.append("<br/>" + j.feed.entry[i].title.$t + "<br/>" + (settings.showAlbumdate ? $album_date : "") + (settings.showAlbumPhotoCount ? "&nbsp;&nbsp;&nbsp;&nbsp;" + j.feed.entry[i].gphoto$numphotos.$t + " " + settings.labels.photos : ""));
	                    }
                    	
                    	DBset($id_base,$scAlbum.html());
                    	
                    	var time6=new Date(); time6=time6.getTime();
						console.log("ho richiesto foto in : "+ parseInt(time6-time5))
                    	
                    	
                    	
                    	
                    }
                    else{
                    	
                    	$scAlbum=DBget($id_base);
                    	var time6=new Date(); time6=time6.getTime();
						console.log("ho preso da local storage in : "+ parseInt(time6-time5))
                    }
                    
                    
                    $scAlbums.append($scAlbum);
                }
               
            }
                             
            $scAlbums.append("<div style='clear: both;height:0px;'/>");
            
            //alert($scAlbums.html())
			
            settings.albumstore = j;
            
            show(false, $scAlbums);
            
        }
        
        
        function albumsWithLazyLoad(j) {
        	
            var $scAlbums = $("<div/>"), i = 0;
            var $na = 0, $navrow = "";
            i = settings.albumsPerPage * (settings.albumPage - 1);
            $na = j.feed.entry.length;
            while (i < settings.albumMaxResults && i < $na && i < (settings.albumsPerPage * settings.albumPage)) {
                var $id_base = j.feed.entry[i].gphoto$name.$t,
				$album_date = formatDate(j.feed.entry[i].gphoto$timestamp.$t),
				$thumb = j.feed.entry[i].media$group.media$thumbnail[0].url.replace(new RegExp("/s160-c/", "g"), "/");
                if ($.inArray($id_base, settings.albums) > -1 || settings.albums.length === 0) {
                    $scAlbum = $("<div class='pwi_album'/>");
                    var jfeed = j.feed.entry[i];
                    $scAlbum.bind('click.pwi', jfeed, function (e) {
                        e.stopPropagation();
                        settings.page = 1;
                        settings.album = e.data.gphoto$name.$t;
                        if (typeof (settings.onclickAlbumThumb) === "function") {
                            settings.onclickAlbumThumb(e);
                            return false;
                        } else {
                            getAlbum();
                            return false;
                        }
                    });
                    
                    if (settings.showAlbumThumbs) {
                    	
                    	//var img= "<img src='" + $thumb + "?imgmax=" + settings.albumThumbSize + "&crop=" + settings.albumCrop + "'/>";
                    	var img="<img class='lazy' data-pippo='pluto' src='loading_photos.gif' data-original='" + $thumb + "?imgmax=" + settings.albumThumbSize + "&crop=" + settings.albumCrop + "'/>";
                        $scAlbum.html(img);
                        $scAlbum.find("img").lazyload();
                    }
                    if (settings.showAlbumTitles) {
                        $scAlbum.append("<br/>" + j.feed.entry[i].title.$t + "<br/>" + (settings.showAlbumdate ? $album_date : "") + (settings.showAlbumPhotoCount ? "&nbsp;&nbsp;&nbsp;&nbsp;" + j.feed.entry[i].gphoto$numphotos.$t + " " + settings.labels.photos : ""));
                    }
                    $scAlbums.append($scAlbum);
                }
                i++;
            }
                             
            $scAlbums.append("<div style='clear: both;height:0px;'/>");
            


            // less albums-per-page then max so paging

            if ($na > settings.albumsPerPage) {
                var $pageCount = ($na / settings.albumsPerPage);
                var $ppage = $("<div class='pwi_prevpage'/>").text(settings.labels.prev),
				$npage = $("<div class='pwi_nextpage'/>").text(settings.labels.next);
                $navRow = $("<div class='pwi_pager'/>");
                if (settings.albumPage > 1) {
                    $ppage.addClass('link').bind('click.pwi', function (e) {
                        e.stopPropagation();
                        settings.albumPage = (parseInt(settings.albumPage, 10) - 1);
                        albums(j);
                        return false;
                    });
                }
                
                $navRow.append($ppage);
                for (var p = 1; p < $pageCount + 1; p++) {
                    if (p == settings.albumPage) {
                        tmp = "<div class='pwi_pager_current'>" + p + "</div> ";
                    } else {
                        tmp = $("<div class='pwi_pager_page'>" + p + "</div>").bind('click.pwi', p, function (e) {
                            e.stopPropagation();
                            settings.albumPage = e.data;
                            albums(j);
                            return false;
                        });
                    }
                    $navRow.append(tmp);
                }
                if (settings.albumPage < $pageCount) {
                    $npage.addClass('link').bind('click.pwi', function (e) {
                        e.stopPropagation();
                        settings.albumPage = (parseInt(settings.albumPage, 10) + 1);
                        albums(j);
                        return false;
                    });
                }
                $navRow.append($npage);
                alert($navRow.html())

                $navRow.append("<div style='clear: both;height:0px;'/>");

                if ($navRow.length > 0 && (settings.showPager === 'both' || settings.showPager === 'top')) {
                  
                    $scAlbums.append($navRow);
                }
                if ($navRow.length > 0 && (settings.showPager === 'both' || settings.showPager === 'bottom')) {
                	 
                    $scAlbums.prepend($navRow.clone(true));
                }
            }

            // end paging
				
				 settings.albumstore = j;
            	 show(false, $scAlbums);
         		
			
				    	
           
        }
        
        
        
        //--END new by hicTech

        function albums(j) {
            var $scAlbums = $("<div/>"), i = 0;
            var $na = 0, $navrow = "";
            i = settings.albumsPerPage * (settings.albumPage - 1);
            $na = j.feed.entry.length;
            while (i < settings.albumMaxResults && i < $na && i < (settings.albumsPerPage * settings.albumPage)) {
                var $id_base = j.feed.entry[i].gphoto$name.$t,
				$album_date = formatDate(j.feed.entry[i].gphoto$timestamp.$t),
				$thumb = j.feed.entry[i].media$group.media$thumbnail[0].url.replace(new RegExp("/s160-c/", "g"), "/");
                if ($.inArray($id_base, settings.albums) > -1 || settings.albums.length === 0) {
                    $scAlbum = $("<div class='pwi_album'/>");
                    var jfeed = j.feed.entry[i];
                    $scAlbum.bind('click.pwi', jfeed, function (e) {
                        e.stopPropagation();
                        settings.page = 1;
                        settings.album = e.data.gphoto$name.$t;
                        if (typeof (settings.onclickAlbumThumb) === "function") {
                            settings.onclickAlbumThumb(e);
                            return false;
                        } else {
                            getAlbum();
                            return false;
                        }
                    });
                    
                    if (settings.showAlbumThumbs) {
                        $scAlbum.html("<img  src='" + $thumb + "?imgmax=" + settings.albumThumbSize + "&crop=" + settings.albumCrop + "'/>");
                    }
                    if (settings.showAlbumTitles) {
                        $scAlbum.append("<br/>" + j.feed.entry[i].title.$t + "<br/>" + (settings.showAlbumdate ? $album_date : "") + (settings.showAlbumPhotoCount ? "&nbsp;&nbsp;&nbsp;&nbsp;" + j.feed.entry[i].gphoto$numphotos.$t + " " + settings.labels.photos : ""));
                    }
                    $scAlbums.append($scAlbum);
                }
                i++;
            }
                             
            $scAlbums.append("<div style='clear: both;height:0px;'/>");
            


            // less albums-per-page then max so paging

            if ($na > settings.albumsPerPage) {
                var $pageCount = ($na / settings.albumsPerPage);
                var $ppage = $("<div class='pwi_prevpage'/>").text(settings.labels.prev),
				$npage = $("<div class='pwi_nextpage'/>").text(settings.labels.next);
                $navRow = $("<div class='pwi_pager'/>");
                if (settings.albumPage > 1) {
                    $ppage.addClass('link').bind('click.pwi', function (e) {
                        e.stopPropagation();
                        settings.albumPage = (parseInt(settings.albumPage, 10) - 1);
                        albums(j);
                        return false;
                    });
                }
                
                $navRow.append($ppage);
                for (var p = 1; p < $pageCount + 1; p++) {
                    if (p == settings.albumPage) {
                        tmp = "<div class='pwi_pager_current'>" + p + "</div> ";
                    } else {
                        tmp = $("<div class='pwi_pager_page'>" + p + "</div>").bind('click.pwi', p, function (e) {
                            e.stopPropagation();
                            settings.albumPage = e.data;
                            albums(j);
                            return false;
                        });
                    }
                    $navRow.append(tmp);
                }
                if (settings.albumPage < $pageCount) {
                    $npage.addClass('link').bind('click.pwi', function (e) {
                        e.stopPropagation();
                        settings.albumPage = (parseInt(settings.albumPage, 10) + 1);
                        albums(j);
                        return false;
                    });
                }
                $navRow.append($npage);
                alert($navRow.html())

                $navRow.append("<div style='clear: both;height:0px;'/>");

                if ($navRow.length > 0 && (settings.showPager === 'both' || settings.showPager === 'top')) {
                  
                    $scAlbums.append($navRow);
                }
                if ($navRow.length > 0 && (settings.showPager === 'both' || settings.showPager === 'bottom')) {
                	 
                    $scAlbums.prepend($navRow.clone(true));
                }
            }

            // end paging
			
            settings.albumstore = j;
            show(false, $scAlbums);
        }

        function album(j) {
            var $scPhotos, $scPhotosDesc, tmp = "",
			$np = j.feed.openSearch$totalResults.$t,
			$at = "", $navRow = "",
			$loc = j.feed.gphoto$location === undefined ? "" : j.feed.gphoto$location.$t,
			$ad = j.feed.subtitle === undefined ? "" : j.feed.subtitle.$t,
			$album_date = formatDate(j.feed.gphoto$timestamp === undefined ? '' : j.feed.gphoto$timestamp.$t),
			$item_plural = ($np == "1") ? false : true;

            $at = (j.feed.title === "undefined" || settings.albumTitle.length > 0) ? settings.albumTitle : j.feed.title.$t;
            $scPhotos = $("<div/>");
            if (settings.mode != 'album' && settings.mode != 'keyword') {
                tmp = $("<div class='pwi_album_backlink'>" + settings.labels.albums + "</div>").bind('click.pwi', function (e) {
                    e.stopPropagation();
                    getAlbums();
                    return false;
                });
                
                $scPhotos.append(tmp);
            }
            if (settings.showAlbumDescription) {
                $scPhotosDesc = $("<div class='pwi_album_description'/>");
                $scPhotosDesc.append("<div class='title'>" + $at + "</div>");
                $scPhotosDesc.append("<div class='details'>" + $np + " " + ($item_plural ? settings.labels.photos : settings.labels.photo) + (settings.showAlbumdate ? ", " + $album_date : "") + (settings.showAlbumLocation && $loc ? ", " + $loc : "") + "</div>");
                $scPhotosDesc.append("<div class='description'>" + $ad + "</div>");
                if (settings.showSlideshowLink) {
                    if (settings.mode === 'keyword' || settings.keyword !== "") {
                        //alert("currently not supported");
                    } else {
                        $scPhotosDesc.append("<div><a href='http://picasaweb.google.com/" + settings.username + "/" + j.feed.gphoto$name.$t + "" + ((settings.authKey !== "") ? "?authkey=" + settings.authKey : "") + "#slideshow/" + j.feed.entry[0].gphoto$id.$t + "' rel='gb_page_fs[]' target='_new' class='sslink'>" + settings.labels.slideshow + "</a></div>");
                    }
                }
               
                $scPhotos.append($scPhotosDesc);
            }

            if ($np > settings.maxResults) {
                $pageCount = ($np / settings.maxResults);
                var $ppage = $("<div class='pwi_prevpage'/>").text(settings.labels.prev),
				$npage = $("<div class='pwi_nextpage'/>").text(settings.labels.next);
                $navRow = $("<div class='pwi_pager'/>");
                if (settings.page > 1) {
                    $ppage.addClass('link').bind('click.pwi', function (e) {
                        e.stopPropagation();
                        settings.page = (parseInt(settings.page, 10) - 1);
                        getAlbum();
                        return false;
                    });
                }
                $navRow.append($ppage);
                for (var p = 1; p < $pageCount + 1; p++) {
                    if (p == settings.page) {
                        tmp = "<div class='pwi_pager_current'>" + p + "</div> ";
                    } else {
                        tmp = $("<div class='pwi_pager_page'>" + p + "</div>").bind('click.pwi', p, function (e) {
                            e.stopPropagation();
                            settings.page = e.data;
                            getAlbum();
                            return false;
                        });
                    }
                    $navRow.append(tmp);
                }
                if (settings.page < $pageCount) {
                    $npage.addClass('link').bind('click.pwi', function (e) {
                        e.stopPropagation();
                        settings.page = (parseInt(settings.page,10) + 1);
                        getAlbum();
                        return false;
                    });
                }
                $navRow.append($npage);
                $navRow.append("<div style='clear: both;height:0px;'/>");
            }

            if ($navRow.length > 0 && (settings.showPager === 'both' || settings.showPager === 'top')) {
                $scPhotos.append($navRow);
            }

            var i = ((settings.page - 1) * settings.maxResults);

            while (i < (settings.maxResults * settings.page) && i < $np) {
                var $scPhoto = photo(j.feed.entry[i]);
                $scPhotos.append($scPhoto);
                i++;
            }

            if ($navRow.length > 0 && (settings.showPager === 'both' || settings.showPager === 'bottom')) {
                $scPhotos.append($navRow.clone(true));
            }

            settings.photostore[settings.album] = j;
            var $s = $(".pwi_photo", $scPhotos).css(settings.thumbCss);
            if (typeof (settings.popupExt) === "function") {
                settings.popupExt($s.find("a[rel='lb-" + settings.username + "']"));
            } else if (typeof (settings.onclickThumb) != "function" && $.slimbox) {
                $s.find("a[rel='lb-" + settings.username + "']").slimbox(settings.slimbox_config);
            }
            show(false, $scPhotos);
        }

        function latest(j) {
            var $scPhotos = $("<div/>"),
			$len = j.feed ? j.feed.entry.length : 0,
			i = 0;
            while (i < settings.maxResults && i < $len) {
                var $scPhoto = photo(j.feed.entry[i]);
                $scPhotos.append($scPhoto);
                i++;
            }
            $scPhotos.append("<div style='clear: both;height:0px;'> </div>");
            var $s = $("div.pwi_photo", $scPhotos).css(settings.thumbCss);
            if (typeof (settings.popupExt) === "function") {
                settings.popupExt($s.find("a[rel='lb-" + settings.username + "']"));
            } else if (typeof (settings.onclickThumb) != "function" && $.slimbox) {
                $s.find("a[rel='lb-" + settings.username + "']").slimbox(settings.slimbox_config);
            }
            show(false, $scPhotos);
        }
        
        
        //-- new by hicTech
        function slideShow(j) {
        	
            var $scPhotos = $("<div/>"),
			$len = j.feed ? j.feed.entry.length : 0,
			i = 0;
            while (i < settings.maxResults && i < $len) {
                var $scPhoto = slide(j.feed.entry[i]);
                $scPhotos.append($scPhoto);
                i++;
            }
            //$scPhotos.append("<div style='clear: both;height:0px;'> </div>");
            var $s = $("div.pwi_photo", $scPhotos).css(settings.thumbCss);
            if (typeof (settings.popupExt) === "function") {
                settings.popupExt($s.find("a[rel='lb-" + settings.username + "']"));
            } else if (typeof (settings.onclickThumb) != "function" && $.slimbox) {
                $s.find("a[rel='lb-" + settings.username + "']").slimbox(settings.slimbox_config);
            }
            
            show(false, $scPhotos);
            
            
            $self.children().addClass("SlideShowContainer")
            var v=new divSlideshow($self.children(),settings.hicSettings.slideShowSettings);
        }
        
        function appMLcarousel(j){

            var $scPhotos = $("<div/>"),
			$len = j.feed ? j.feed.entry.length : 0,
			i = 0;
            for (var i=0; i < $len; i++) {
            	console.log("richiedo")
                var $scPhoto = carouserlLi(j.feed.entry[i]);
                $scPhotos.append($scPhoto);
                if(i==$len-1){
                	animaCarouselDettaglio(); // vedi stampaModuli.js
                }
            }
            console.log("sparo")
            $scPhotos.append("<div style='clear: both;height:0px;'> </div>");
            show(false, $scPhotos);
           
        }
        
      
        
        
        function brands(j) {
        	
            var $scPhotos = $("<div/>"),
			$len = j.feed ? j.feed.entry.length : 0,
			i = 0;
            while (i < settings.maxResults && i < $len) {
                var $scPhoto = brand(j.feed.entry[i]);
                $scPhotos.append($scPhoto);
                i++;
            }
            //$scPhotos.append("<div style='clear: both;height:0px;'> </div>");
            var $s = $("div.pwi_photo", $scPhotos).css(settings.thumbCss);
            if (typeof (settings.popupExt) === "function") {
                settings.popupExt($s.find("a[rel='lb-" + settings.username + "']"));
            } else if (typeof (settings.onclickThumb) != "function" && $.slimbox) {
                $s.find("a[rel='lb-" + settings.username + "']").slimbox(settings.slimbox_config);
            }
            
            show(false, $scPhotos);
            
            var v=new divSlideshow($self.children(),settings.hicSettings.slideShowSettings);
            
            
            
        }
        
        
        
        function getAlbumsWithLocalStorageCache() {
            if (settings.albumstore.feed) {
                albums(settings.albumstore);
            } else {
                show(true, '');
                var $u = 'http://picasaweb.google.com/data/feed/api/user/' + settings.username + '?kind=album&access=' + settings.albumTypes + '&alt=json';
                $.getJSON($u, 'callback=?', albumsWithLocalStorage);
            }
            return $self;
        }
        
        //-- END new by hicTech
        

        function clickAlbumThumb(event) {
            event.stopPropagation();
            event.preventDefault();
            settings.onclickAlbumThumb(event);
        }
        function clickThumb(event) {
            event.stopPropagation();
            event.preventDefault();
            settings.onclickThumb(event);
        }
        function getAlbums() {
            if (settings.albumstore.feed) {
                albums(settings.albumstore);
            } else {
                show(true, '');
                var $u = 'http://picasaweb.google.com/data/feed/api/user/' + settings.username + '?kind=album&access=' + settings.albumTypes + '&alt=json';
                $.getJSON($u, 'callback=?', albums);
            }
            return $self;
        }
        function getAlbum() {
            if (settings.photostore[settings.album]) {
                album(settings.photostore[settings.album]);
            } else {
                var $si = ((settings.page - 1) * settings.maxResults) + 1;
                var $u = 'http://picasaweb.google.com/data/feed/api/user/' + settings.username + '/album/' + settings.album + '?kind=photo&alt=json' + ((settings.authKey !== "") ? "&authkey=" + settings.authKey : "") + ((settings.keyword !== "") ? "&tag=" + settings.keyword : "");
                show(true, '');
                $.getJSON($u, 'callback=?', album);
            }
            return $self;
        }
        function getLatest() {
            show(true, '');
            var $u = 'http://picasaweb.google.com/data/feed/api/user/' + settings.username + (settings.album !== "" ? '/album/' + settings.album : '') + '?kind=photo&max-results=' + settings.maxResults + '&alt=json&q=' + ((settings.authKey !== "") ? "&authkey=" + settings.authKey : "") + ((settings.keyword !== "") ? "&tag=" + settings.keyword : "");
            $.getJSON($u, 'callback=?', latest);
            return $self;
        }
        
        //-- new get by hicTech
        
        
        function getAlbumsWithLazyLoad(){
        	
            if (settings.albumstore.feed) {
                albums(settings.albumstore);
            } else {
                show(true, '');
                var $u = 'http://picasaweb.google.com/data/feed/api/user/' + settings.username + '?kind=album&access=' + settings.albumTypes + '&alt=json';
                $.getJSON($u, 'callback=?', albumsWithLazyLoad);
            }
            return $self;
        }
        
        function getHicSlideshow() {
            show(true, '');
            var $u = 'http://picasaweb.google.com/data/feed/api/user/' + settings.username + '/album/' + settings.album + '?kind=photo&alt=json' + ((settings.authKey !== "") ? "&authkey=" + settings.authKey : "") + ((settings.keyword !== "") ? "&tag=" + settings.keyword : "");
                $.getJSON($u, 'callback=?', slideShow);
            return $self;
        }
        
        function getAppMLcarousel() {
            show(true, '');
            var $u = 'http://picasaweb.google.com/data/feed/api/user/' + settings.username + '/album/' + settings.album + '?kind=photo&alt=json' + ((settings.authKey !== "") ? "&authkey=" + settings.authKey : "") + ((settings.keyword !== "") ? "&tag=" + settings.keyword : "");
                $.getJSON($u, 'callback=?', appMLcarousel);
            return $self;
        }
        
        function getProducts() {
            if (settings.albumstore.feed) {

                products(settings.albumstore);
            } else {
                show(true, '');
                var $u = 'http://picasaweb.google.com/data/feed/api/user/' + settings.username + '?kind=album&access=' + settings.albumTypes + '&alt=json';
                $.getJSON($u, 'callback=?', products);
            }
            return $self;
        }
        
        function getProduct() {
            if (settings.photostore[settings.album]) {
                product(settings.photostore[settings.album]);
            } else {
                var $si = ((settings.page - 1) * settings.maxResults) + 1;
                var $u = 'http://picasaweb.google.com/data/feed/api/user/' + settings.username + '/album/' + settings.album + '?kind=photo&alt=json' + ((settings.authKey !== "") ? "&authkey=" + settings.authKey : "") + ((settings.keyword !== "") ? "&tag=" + settings.keyword : "");
                show(true, '');
                $.getJSON($u, 'callback=?', product);
            }
            return $self;
        }
        
        function tronca(cosa,quanto){
			if(cosa.length>quanto){
				return cosa.substr(0,quanto)+"...";
				}
			else return cosa;
		}
		
			
  function getBrands() {
            show(true, '');
            var $u = 'http://picasaweb.google.com/data/feed/api/user/' + settings.username + '/album/' + settings.album + '?kind=photo&alt=json' + ((settings.authKey !== "") ? "&authkey=" + settings.authKey : "") + ((settings.keyword !== "") ? "&tag=" + settings.keyword : "");
                $.getJSON($u, 'callback=?', brands);
            return $self;
        }
        
        //--
        
        
        function show(loading, data, effect) {
            if (loading) {
                document.body.style.cursor = "wait";
                //if ($.blockUI){ $self.block(settings.blockUIConfig);}
            } else {
                document.body.style.cursor = "default";
                //if ($.blockUI){ $self.unblock(); }
                $self.parent().html(data)
                
            }
           
        }
        _initialize();
    };

    $.fn.pwi.defaults = {
        mode: 'albums', //-- can be: album, albums, latest (keyword = obsolete but backwards compatible, now just fill in a keyword in the settings to enable keyword-photos)
        username: '', //-- Must be explicitly set!!!
        album: "", //-- For loading a single album
        authKey: "", //-- for loading a single album that is private (use in 'album' mode only)
        albums: [], //-- use to load specific albums only: ["MyAlbum", "TheSecondAlbumName", "OtherAlbum"]
        keyword: "", 
        albumCrop: 1, //-- crop thumbs on albumpage to have all albums in square thumbs (see albumThumbSize for supported sizes)
        albumTitle: "", //-- overrule album title in 'album' mode
        albumThumbSize: 160, //-- specify thumbnail size of albumthumbs (default: 72, cropped not supported, supported cropped/uncropped: 32, 48, 64, 160 and uncropped only: 72, 144, 200, 288, 320, 400, 512, 576, 640, 720, 800) 
        albumMaxResults: 999, //-- load only the first X albums
        albumsPerPage: 999, //-- show X albums per page (activates paging on albums when this amount is less then the available albums)
        albumPage: 1, //-- force load on specific album
        albumTypes: "public", //-- load public albums, not used for now
        page: 1, //-- initial page for an photo page
        photoSize: 800, //-- size of large photo loaded in slimbox, fancybox or other
        maxResults: 50, //-- photos per page
        showPager: 'bottom', //'top', 'bottom', 'both' (for both albums and album paging)
        thumbSize: 137,  //-- specify thumbnail size of photos (default: 72, cropped not supported, supported cropped/uncropped: 32, 48, 64, 160 and uncropped only: 72, 144, 200, 288, 320, 400, 512, 576, 640, 720, 800) 
        thumbCrop: 0, //-- force crop on photo thumbnails (see thumbSize for supported sized)
        thumbCss: {
            'margin': '5px'
        },
        
        //////////////////////////// hicTech
        hicSettings:{
        	slideShowSettings:{
        			'autostart'                : false,
					'slide_permanence'         : 6000,
					'transaction_duration'     : 300,
					'out_effect'               : 'fade',    
					'in_effect'                : 'fade',
					'start_slide'              : 0,
					'controller'               : true,
					'controller_top_margin'    : 10,
					'controller_left_margin'   : 15,
					'indicators'               : true,
					'indicators_top_margin'    : 270,
					'indicatorClick'           : false
        	},
        	productsSubStrIdentifier: "art."
        },
        onclickThumb: "", //-- overload the function when clicked on a photo thumbnail
        onclickAlbumThumb: "", //-- overload the function when clicked on a album thumbnail
        popupExt: "", //-- extend the photos by connecting them to for example Fancybox (see demos for example)
        showAlbumTitles: true,  //--following settings should be self-explanatory
        showAlbumThumbs: true,
        showAlbumdate: true,
        showAlbumPhotoCount: true,
        showAlbumDescription: true,
        showAlbumLocation: true,
        showSlideshowLink: true,
        showPhotoCaption: false,
        showPhotoCaptionDate: false,
        showCaptionLength: 9999,
        showPhotoDownload: false,
        showPhotoDate: false,
        labels: {
            photo: "photo",
            photos: "photos",
            albums: "Back to albums",
            slideshow: "Display slideshow",
            loading: "PWI fetching data...",
            page: "Page",
            prev: "Previous",
            next: "Next",
            devider: "|"
        }, //-- translate if needed
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        slimbox_config: {
            loop: false,
            overlayOpacity: 0.6,
            overlayFadeDuration: 400,
            resizeDuration: 400,
            resizeEasing: "swing",
            initialWidth: 250,
            initlaHeight: 250,
            imageFadeDuration: 400,
            captionAnimationDuration: 400,
            counterText: "{x}/{y}",
            closeKeys: [27, 88, 67, 70],
            prevKeys: [37, 80],
            nextKeys: [39, 83]
        }, //-- overrule defaults is needed
        blockUIConfig: {
            message: "<div class='lbLoading pwi_loader'>loading...</div>",
            css: "pwi_loader"
        }, //-- overrule defaults if needed
        albumstore: {}, //-- don't touch
        photostore: {}, //-- don't touch
        token: ""
    };
})(jQuery);