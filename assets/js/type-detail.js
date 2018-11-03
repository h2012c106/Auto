$(document).ready(function () {
  refreshEquation();
});

$('#star-score').on('rating:hover', function (event, value) {
  $('.rating-stars').prop({
    title: `${value}分`
  });
});

$('#star-score').on('rating:change', function (event, value) {
  let score = Number(value);
  let carId = Number($('.self-score').data('carid'));
  let typeId = Number($('.self-score').data('typeid'));
  $.ajax({
    type: 'POST',
    url: '/car-score',
    data: { score, carId, typeId },
    dataType: 'json',
    success: function (data) {
      if (data.success) {
        window.location.reload();
      } else {
        alert(data.info);
      }
    },
    error: function (xhr, e) {
      alert(JSON.stringify(e));
    }
  });
});

$('.recom-btn').click(function () {
  $('.recom-btn').removeClass('chosen');
  $(this).addClass('chosen');

  let type = $(this).data('type');
  let data = {
    type,
    carId: $('.recom-btn-wrapper').data('carid'),
    price: $('.recom-btn-wrapper').data('price'),
    wheelbase_mm: $('.recom-btn-wrapper').data('wheelbase_mm')
  };
  switch (type) {
    case 'shape':
      data.carClass = $(this).data('carclass');
      data.struct = $(this).data('struct');
      break;
    case 'power':
      data.paiLiang_ml = $(this).data('pailiang_ml');
      break;
    case 'acce':
      data.maxTorque_nm = $(this).data('maxtorque_nm');
      data._0_100_s = $(this).data('_0_100_s');
      break;
    case 'drive':
      data.drive = $(this).data('drive');
      break;
    case 'energy':
      data.environStan = $(this).data('environstan');
      data.youHao_lkm = $(this).data('youhao_lkm');
      data.energy = $(this).data('energy');
      break;
    default:
      break;
  }

  $.ajax({
    type: 'POST',
    url: '/car-recom',
    data,
    dataType: 'json',
    success: function (data) {
      if (data.carArr.length === 0) {
        $('.car-items-wrapper').html(tools.EMPTY);
      } else {
        $('.car-items-wrapper').html(tools.assemCar(data.carArr));
      }
    },
    error: function (xhr, e) {
      alert(JSON.stringify(e));
    }
  });
});

$('.select-wrapper select').change(function () {
  refreshEquation();
});

function refreshEquation() {
  let INTEREST = 2 / 375;
  let pay = Number($('select[name="down-pay"] option:selected').val());
  let stage = Number($('select[name="stage"] option:selected').val());
  let price = Number($('.equation').data('price'));
  $('span[data-charac="down-pay"]').text(pay);
  $('span[data-charac="stage"]').text(stage);
  $('span[data-charac="interest"]').text(INTEREST.toFixed(5));
  let res = (price * (1 - pay) * INTEREST * Math.pow((1 + INTEREST), stage)) / (Math.pow((1 + INTEREST), stage) - 1);
  res = res.toFixed(2);
  $('.equation-right').text(`${res}万元`);
}