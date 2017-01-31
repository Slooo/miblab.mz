<!-- 

    All modals

-->

<!-- Modal create -->
@if(Request::is('*/discounts') || Request::is('*/items') || Request::is('*/costs/*'))
<div class="modal fade" id="js-modal--create" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header" style="padding:20px 20px;">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Создать</h4>
      </div>
      <div class="modal-body" style="padding:25px 25px;">
          @include('_forms.create.'.Request::segment(2))
      </div>
    </div>
  </div>
</div>
@endif

<!-- Modal delete -->
<div class="modal fade" id="js-modal--delete" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header" style="padding:20px 20px;">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Вы уверены что хотите удалить?</h4>
      </div>
      <div class="modal-body" style="padding:25px 25px;">
        <button class="btn btn-danger" id="js--delete">Удалить</button>
        <button class="btn btn-default" data-dismiss="modal">Отмена</button>
      </div>
    </div>
  </div>
</div>