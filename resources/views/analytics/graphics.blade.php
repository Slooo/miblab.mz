<!-- 

	Graphics page

-->

@extends('app')

@section('content')

<div class="row">

	<div class="col-md-12 col-header">
		<h2>Графическая аналитика</h2>
		<hr>
	</div>

	<div class="col-md-10 col-md-pull-1 col-md-push-1 col-body">

		<div id="js--hc-allPeriod"></div>
		<hr>
		<div id="js--hc-curMonth"></div>
		<hr>
		<div id="js--hc-sumAllKey"></div>

	</div>

	<div class="col-md-12 col-footer">
		<hr>
	</div>

</div>

@stop

@section('script')
<script>
	var sumAll = [], sumMonth = [], sumAllKey = [],
</script>

@foreach($sumAll as $row)
<script>
	sumAll.push({ y : {{ $row['sum'] = empty($row['sum']) ? 0 : $row['sum'] }} });
	sumAll.push({ name : "{{ $row['costs'] }}" });
</script>
@endforeach

@foreach($sumMonth as $row)
<script>
	sumMonth.push({ y : {{ $row['sum'] = empty($row['sum']) ? 0 : $row['sum'] }} });
	sumMonth.push({ name : "{{ $row['costs'] }}" });
</script>
@endforeach

<script>

	sumAllKey.push({ y : {{ $sumAllKey['profit'] = empty($sumAllKey['profit'] ? 0 : $sumAllKey['profit']) }} });
	sumAllKey.push({ name : "Прибыль"});
</script>

<script>
	hcColumn(JSON.stringify(sumAll), 'js--hc-allPeriod');
	hcColumn(JSON.stringify(sumMonth), 'js--hc-curMonth');
	hcPie(JSON.stringify(sumAllKey), 'js--hc-sumAllKey');
</script>
@stop