function setTitle(text) {
  document.getElementsByTagName('TITLE')[0].innerHTML = text
}


function setCategory(id){
  var category = content[id]

  $.ajax({
    url: 'content/' + id + '.md',
    type: 'get',
    error: function(XMLHttpRequest, textStatus, errorThrown){
      $('#sigil').html('<img src="img/' + id + '.png" width="100%">')
      $('.title').text(category.name)

       $('#neofit-content').text('Контент в разработке')
       $('#category').fadeIn(400)
       resizeWindow()
       setTitle('Not Found')
    },
    success: function(data){
      $('#sigil').html('<img src="img/' + id + '.png" width="100%">')
      $('.title').text(category.name)
      if (category['edit'] != null){
        $('#edit-button').attr('href', category.edit)
        $('#edit-button').removeClass('content-button-dissable')
        $('#edit-button-img').attr('src', '/img/edit-icon.png')
      } else {
        $('#edit-button').addClass('content-button-dissable')
        $('#edit-button-img').attr('src', '/img/transparent-bg.png')
      }

      var converter = new showdown.Converter()
      var html      = converter.makeHtml(data);
      $('#content').html(html)

      $('.cross').click(function() {
        var id = this.getAttribute('data')
        showCategory(id)
        return false
      })
      $('#category').fadeIn(400)
      resizeWindow()
      setTitle(category.name)
   }
  })
}

function addContent(c, shift, last) {
    var value = content[c]
    var res = '<div class="col-12 offset-md-2 col-md-10 text-left">'

    for (var i = 0; i < shift; i++) {
        if (i + 1 !== shift) {
            if (last[i]) {
                res += '<img class="d-none d-sm-inline-block" src="img/tree/space.png" style="width: 5rem; height: 5rem;" />' + '<img class="d-inline-block d-sm-none" src="img/tree/space.png" style="width: 2.5rem; height: 2.5rem;" />'
            } else {
                res += '<img class="d-none d-sm-inline-block" src="img/tree/line.png" style="width: 5rem; height: 5rem;" />' + '<img class="d-inline-block d-sm-none" src="img/tree/line.png" style="width: 2.5rem; height: 2.5rem;" />'
            }
        } else {
            if (last[i]) {
                res += '<img class="d-none d-sm-inline-block" src="img/tree/angle.png" style="width: 5rem; height: 5rem;" />' + '<img class="d-inline-block d-sm-none" src="img/tree/angle.png" style="width: 2.5rem; height: 2.5rem;" />'
            } else {
                res += '<img class="d-none d-sm-inline-block" src="img/tree/branch.png" style="width: 5rem; height: 5rem;" />' + '<img class="d-inline-block d-sm-none" src="img/tree/branch.png" style="width: 2.5rem; height: 2.5rem;" />'
            }
        }
    }

    res += '<a class="content content-c" data="' + c + '" href="?c=' + c + '"><img class="d-none d-sm-inline-block" src="img/mini-icon/' + c  + '.png" style="cursor: pointer; width: 5rem; height: 5rem;margin-right:0.5rem;"><img class="d-inline-block d-sm-none" src="img/mini-icon/' + c  + '.png" style="cursor: pointer; width: 2.5rem; height: 2.5rem; margin-right: 0.5rem;">'  + value.name + '</a>'
    res += '</div>'
    for (var i in value.links) {
        if (last !== undefined) {
            var nextLast = JSON.parse(JSON.stringify(last))
        } else {
            var nextLast = []
        }

        nextLast.push(parseInt(i) + 1 === value.links.length)

        res += addContent(value.links[i], shift + 1, nextLast)
    }
    return res
}

function setContent() {
  var res = '<div style="height: 3rem;" class="row"></div><div class="row">'
  res += addContent('main', 0)
  res += '</div>'
  $('#contents').html(res)
  $('.content-c').click(function() {
    var id = this.getAttribute('data')
    showCategory(id)
    return false
  })
  setTitle('Содержание')
}

function showCategory(id){
  history.pushState(null, null, '?c=' + id)
  reload()
}

function showContent(id) {
  history.pushState(null, null, '?c=content')
  reload()
}

function reload() {
  var url = new URL(window.location.href)
  var c = url.searchParams.get("c");
  if (category.style.display == 'none' && contents.style.display == 'none') {
    if (c == null) {
      setCategory('main')
    } else if (c == 'content') {
      setContent()
      $('#contents').fadeIn(400)
    } else {
      setCategory(c)
    }
  } else {
    $('#category').fadeOut(400)
    $('#contents').fadeOut(400)
    if (c == null) {
      setTimeout(() => setCategory('main'), 400)
      $('#category').delay(400).fadeIn(400)
    } else if (c == 'content') {
      setContent()
      $('#contents').delay(400).fadeIn(400)
    } else {
      setTimeout(() => setCategory(c), 400)
    }
  }
}

$.getJSON('content.json', function(data){
  content = data
  window.onpopstate = reload
  reload()
}).fail(function() {
  console.log('fail')
})

$('.content').click(function() {
  showContent(null)
  return false
})

function resizeWindow() {
  if ($('iframe').length == 0) {
    return
  }
  if ($("iframe")[0].offsetWidth == 0) {
    setTimeout(resizeWindow, 200)
  } else {
    $("iframe").attr('height', $("iframe")[0].offsetWidth / 16 * 9)
  }
}

function reloadColorSchema() {
  if (localStorage.getItem('color-schema') == 'dark') {
    $('#color-theme').first().attr('href', 'css/dark.css')
    $('#color-schema-button-img').attr('src', 'img/sun-icon.png')
  } else {
    $('#color-theme').first().attr('href', 'css/light.css')
    $('#color-schema-button-img').attr('src', 'img/moon-icon.png')
  }
}

function switchColorSchema() {
  if (localStorage.getItem('color-schema') == 'dark') {
    localStorage.setItem('color-schema', 'light')
  } else {
    localStorage.setItem('color-schema', 'dark')
  }
  reloadColorSchema()
}

$('#switch-color-schema').click(switchColorSchema)

$(window).resize(resizeWindow)
reloadColorSchema()
