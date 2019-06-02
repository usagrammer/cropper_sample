$(function dojQueryAjax() {
  var cropper;

  //////////画像の削除ボタンをクリックした時//////////
  $('.delete-btn').on('click', function (e) {
    e.stopPropagation();
    console.log("aa");
    var url = `/api/images/1`
    $.ajax({
        url: url,
        type: 'DELETE',
        dataType: 'json',
      }).done(function (image) {
        $('.cropped-images').children('.cropped-item').remove();
      })
      .fail(function () {
        alert('error');
      })

  });
  //////////画像の削除ボタンをクリックした時ここまで//////////

  //////////画像の編集ボタンをクリックした時//////////
  $('.wrapper').on('click', '.images-field ', function (e) {
    e.stopPropagation();
    before_image = $(this).find("img");
    before_image_filename = $(this).attr('data-image-filename');
    var html = `
    <div class="overlay"></div>
    <div class="cropper__wrapper">
    <img id="crop-image" src = "${before_image.attr('src')}">
    <br>
    <div class="cropper__wrapper--crop-btn">トリミング</div>
    <div class = "cropper__wrapper--cancel-btn"> キャンセル </div>
    </div>
        `
    $('body').append(html);
    cropper = new Cropper($('#crop-image')[0], {
      dragMode: 'move',
      aspectRatio: 1,
      restore: false,
      guides: true,
      center: false,
      highlight: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      minCropBoxWidth: 280,
      minCropBoxHeight: 280,
      ready: function () {
        croppable = true;
      }
    });
  });

  //////////画像の編集ボタンをクリックした時ここまで//////////

  //////////トリミング開始ボタンをクリックした時//////////
  $(document.body).on('click', '.cropper__wrapper--crop-btn ', function () {
    crop_end();
    var crop_data = cropper.getData();
    croppedCanvas = cropper.getCroppedCanvas({
      x: Math.round(crop_data.x),
      y: Math.round(crop_data.y),
      width: Math.round(crop_data.width),
      height: Math.round(crop_data.height),
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'high',
    });
    var result = `<div class="title">トリミング結果</div><img src = ${
      croppedCanvas.toDataURL()
    } >
    `
    $('.result-image-field').html(result);
    result = `<div class="cropped-item"><img src = ${
      croppedCanvas.toDataURL()
    } ></div>
    `
    $('.cropped-images').append(result);
    ///base64形式に変換してからblobを生成する///
    var canvas = croppedCanvas.toDataURL();
    var base64Data = canvas.split(',')[1],
      data = window.atob(base64Data),
      buff = new ArrayBuffer(data.length),
      arr = new Uint8Array(buff),
      blob, i, dataLen;
    for (i = 0, dataLen = data.length; i < dataLen; i++) {
      arr[i] = data.charCodeAt(i);
    }
    blob = new Blob([arr], {
      type: 'image/png'
    });
    ///base64形式に変換してからblobを生成するここまで///
    var cropData = new FormData();
    var now = new Date();
    cropData.append('image', blob, "utya" + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds() + ".jpg");
    url = `/api/images/`
    cropper = null;
    $.ajax({
        url: url,
        type: 'POST',
        data: cropData,
        dataType: 'json',
        processData: false,
        contentType: false,
      }).done(function (jsonResponse) {

      }).fail(function (responese) {
        alert('保存に失敗しました。');
      })
      .always(function () {});
  });
  //////////トリミング開始ボタンをクリックした時ここまで//////////

  //////////トリミングキャンセルボタンをクリックした時//////////
  $(document.body).on('click', '.cropper__wrapper--cancel-btn ', function () {
    cropper = null;
    crop_end();
  });
  //////////トリミングキャンセルボタンをクリックした時ここまで//////////

  //////////トリミング終了//////////
  function crop_end() {
    $('.overlay').remove();
    $('.cropper__wrapper').remove();
    console.log("aaaad");
  };
  //////////トリミング終了ここまで//////////

});
