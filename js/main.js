$('#map_for_book').css('height', $(window).height() - $('.nav-wrapper').height());
$('#infoBar').css('max-height', $(window).height() - $('.nav-wrapper').height() );
let bookId = localStorage.getItem('bookId')||1;

var resizeTimer;
$(window).on('resize', function(e) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        $('#map_for_book').css('height', $(window).height() - $('.nav-wrapper').height() );
        $('#infoBar').css('max-height', $(window).height() - $('.nav-wrapper').height() );
    }, 250);
});


        let inf;
        let map ;
        // запрос информации о книге
        reqwest({
            url: 'data/'+bookId+'.json',
            type: 'json',
            method: 'post',
            error: function(err) {
            location.replace('404.html');
            },
            success: function(resp) {
                inf = resp;
                console.log(inf)
                map  = new Map('map_for_book')
         
                document.getElementById('author_name').innerHTML = inf["author"];
                document.getElementById('book_name').innerHTML = inf["name"];
                document.getElementById('book_desc').innerHTML = inf["description"];   
                let i = 1;
                let infVals = Object.values(inf.place);
                infVals.forEach(function(element,index) {
                    if (element.showpopup==1){
                        $('#placeList').append(' <li class="collection-item placeListItem" onclick= map.openMark('+i+')><p class="book_info ">' + i+
                        '.   ' + element["name"] +
                        '</p></li>')
                        i++;
                     map.addMark(element);
                    }
                });
                map.setView(1)
                map.drawPath(infVals)
            }
        })



        class Map {
          constructor(elementId) {
            this.map = L.map(elementId);
            this.marks = [];
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
            this.paths = [];
          }
        
          addMark(element){         
                this.marks.push(L.marker([element["latitude"], element["longitude"]]).addTo(this.map)
                    .bindPopup('<p>' + element["name"] + '</p><p>' + element["desc"] + '</p>'));
          }

          drawPath(elements){ 
                let path = [];
                path = elements.map(function callback(element) { 
                    return new L.LatLng(element["latitude"], element["longitude"])
                });
                var Polyline = new L.Polyline(path, {
                    color: 'rgb(21, 175, 129)',
                    weight: 3,
                    opacity: 0.7,
                    smoothFactor: 1
                });
                Polyline.addTo(this.map);
                this.paths.push(Polyline);
          }  
          
          openMark(id){
              id = id-1;
              this.marks[id].openPopup();
              this.setView(id)
          }

          setView(id){
            this.map.setView([this.marks[id]._latlng.lat, this.marks[id]._latlng.lng], 4);
        }
          
        };

        //map.map.removeLayer(map.paths[0])  - удалить слой