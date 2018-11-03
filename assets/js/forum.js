let forumArr;
let tmpPage = 1;
let pageNum;

$(document).ready(function () {
  let data = {};
  if (location.search.indexOf("?") !== -1) {
    data = tools.qsToFd(location.search.substr(1));
  }
  $.ajax({
    type: 'POST',
    url: '/forum-query',
    data,
    dataType: 'json',
    success: function (data) {
      console.log(data);
      if (data.forumArr.length === 0) {
        $('.post-wrapper').html(tools.EMPTY);
      } else {
        forumArr = data.forumArr;
        pageNum = calcPageNum(forumArr.length);
        $('.pagination-wrapper').html(tools.assemPagination(pageNum));
        $('.pagination-wrapper .pagination span.page-link[data-page="1"]').click();
      }
    },
    error: function (xhr, e) {
      alert(JSON.stringify(e));
    }
  });
});

$('.pagination-wrapper').on('click', 'span.page-link', function () {
  if (!$(this).hasClass('disabled')) {
    // Remove the active style
    $('.pagination-wrapper .pagination li.page-item').removeClass('active');

    let page = $(this).data('page');
    if (page === 'prv') {
      tmpPage -= 1;
      tmpPage = Math.max(tmpPage, 1);
    } else if (page === 'nxt') {
      tmpPage += 1;
      tmpPage = Math.min(tmpPage, pageNum);
    } else {
      tmpPage = Number(page);
      tmpPage = Math.max(tmpPage, 1);
      tmpPage = Math.min(tmpPage, pageNum);
    }

    // Add the active style and disabled style for prv/nxt
    $(`.pagination-wrapper .pagination span.page-link[data-page="${tmpPage}"]`).parent().addClass('active');
    if (tmpPage === 1) {
      $('.pagination-wrapper .pagination span.page-link[data-page="prv"]').parent().addClass('disabled');
    }
    if (tmpPage === pageNum) {
      $('.pagination-wrapper .pagination span.page-link[data-page="nxt"]').parent().addClass('disabled');
    }
    $('.post-wrapper').html(tools.assemForum(mySlice(forumArr, tmpPage)));
  }
});

function calcPageNum(arrLen) {
  return Math.ceil(arrLen / tools.PAGECAP);
}

function mySlice(arr, tmpPage) {
  return arr.slice(Math.max(0, (tmpPage - 1) * tools.PAGECAP), tmpPage * tools.PAGECAP);
}