@extends('app')
<!-- 

	Graphics page

-->

@section('content')

<div class="row">

	<div class="col-md-12 col-header">
		<h2>Графическая аналитика</h2>
		<hr>
	</div>

	<div class="col-md-10 col-md-pull-1 col-md-push-1 col-body">

		<div id="js--hc-sumAll"></div>
		<hr>
		<div id="js--hc-sumMonth"></div>
		<hr>
		<div id="js--hc-sumAllKey"></div>
		<hr>
		<div id="js--hc-sum30DaysSO"></div>
		<hr>
		<div id="js--hc-sumMonthPoint"></div>
		<hr>
		<div id="js--hc-sumWeek"></div>
	</div>

	<div class="col-md-12 col-footer">
		<hr>
	</div>

</div>

@stop

@section('script')
<script>
var sumAll = [], 
	sumMonth = [], 
	sumAllKey = [], 
	sumAllKeyPoint = [], 
	sum30DaysSO = [],
	sumMonthPoint = [], 
	sumWeek = {},
	categories = [],
	data = [];
	sumWeek.categories = categories;
	sumWeek.data = data;

	arr = [], obj = {};

@foreach($sumAll as $row)
	sumAll.push({ y : {{ $row['sum'] = empty($row['sum']) ? 0 : $row['sum'] }}, name : "{{ $row['costs'] }}" });
@endforeach

@foreach($sumMonth as $row)
	sumMonth.push({ y : {{ $row['sum'] = empty($row['sum']) ? 0 : $row['sum'] }}, name : "{{ $row['costs'] }}" });
@endforeach

	sumAllKey.push(graphParseData(['Прибыль', {{ $sumAllKey['profit'] }}], false));
	sumAllKey.push(graphParseData(['Продажи', {{ $sumAllKey['orders'] }}], false));
	sumAllKey.push(graphParseData(['Расходы', {{ $sumAllKey['costs'] }}], false));
	sumAllKey.push(graphParseData(['Закупка', {{ $sumAllKey['supply'] }}], false));
	sumAllKey.push(graphParseData(['Склад', {{ $sumAllKey['stock'] }}], false));


@foreach($sumAllKeyPoint as $key => $row)
	$('#js--hc-sumAllKey').after('<div class="hc-line" id="js--hc-sumAllKeyPoint_{{ $key }}"></div>');

	sumAllKeyPoint.push(graphParseData(['Прибыль', {{ $row['profit'] }}], false));
	sumAllKeyPoint.push(graphParseData(['Продажи', {{ $row['orders'] }}], false));
	sumAllKeyPoint.push(graphParseData(['Расходы', {{ $row['costs'] }}], false));
	sumAllKeyPoint.push(graphParseData(['Закупка', {{ $row['supply'] }}], false));
	sumAllKeyPoint.push(graphParseData(['Склад', {{ $row['stock'] }}], false));

	sumAllKeyPoint{{ $key }} = {};
	sumAllKeyPoint{{ $key }}.id = 'js--hc-sumAllKeyPoint_{{ $key }}';
	sumAllKeyPoint{{ $key }}.type = 'hcPie';
	sumAllKeyPoint{{ $key }}.description = 'Ключевые показатели по точке #{{ $key }}';
	sumAllKeyPoint{{ $key }}.data = JSON.stringify(sumAllKeyPoint);
	arr.push(sumAllKeyPoint{{ $key }});

	sumAllKeyPoint = [];
@endforeach

@foreach($sumMonthPoint as $row)
	sumMonthPoint.push(graphParseData(['Точка #{{ $row['point'] }}', {{ $row['sum'] }}], false));
@endforeach

@foreach($sumWeek as $row)
	sumWeek.categories.push("{{ $row['date'] }}");
	sumWeek.data.push({{ $row['sum'] }});
@endforeach

$('#js--hc-sumAllKey').after('<hr>');
sum30DaysSO.push(['Закупка за 30 дней', {{ $sum30DaysSupply = empty($sum30DaysSupply) ? 0 : $sum30DaysSupply }}]);
sum30DaysSO.push(['Реализация за 30 дней', {{ $sum30DaysOrders = empty($sum30DaysOrders) ? 0 : $sum30DaysOrders }}]);
	
	objSumAll = {};
	objSumAll.id = 'sumAll';
	objSumAll.type = 'hcColumn';
	objSumAll.description = 'За весь период';
	objSumAll.data = sumAll;
	arr.push(objSumAll);

	objSumMonth = {};
	objSumMonth.id = 'sumMonth';
	objSumMonth.type = 'hcColumn';
	objSumMonth.description = 'За период';
	objSumMonth.data = sumMonth;
	arr.push(objSumMonth);

	objSumAllKey = {};
	objSumAllKey.id = 'sumAllKey';
	objSumAllKey.type = 'hcPie';
	objSumAllKey.description = 'Ключевые показатели';
	objSumAllKey.data = sumAllKey;
	arr.push(objSumAllKey);

	objSum30DaysSO = {};
	objSum30DaysSO.id = 'sum30DaysSO';
	objSum30DaysSO.type = 'hcWdl';
	objSum30DaysSO.description = 'Закупка и реализация';
	objSum30DaysSO.sum30DaysSO = sum30DaysSO;
	arr.push(objSum30DaysSO);
	
	objSumMonthPoint = {};
	objSumMonthPoint.id = 'sumMonthPoint';
	objSumMonthPoint.type = 'hcPie';
	objSumMonthPoint.description = 'Прибыль понедельно по точкам (за 30 дней)';
	objSumMonthPoint.sumMonthPoint = sumMonthPoint;
	arr.push(objSumMonthPoint);

	objSumWeek = {};
	objSumWeek.id = 'sumWeek';
	objSumWeek.type = 'hcInverted';
	objSumWeek.description = 'Прибыль понедельно (за 30 дней)';
	objSumWeek.sumWeek = sumWeek;
	arr.push(objSumWeek);

hcAnalytics(arr);

//hcColumn(JSON.stringify(sumAll), 'За весь период');
//hcColumn(JSON.stringify(sumMonth), 'За период');
//hcPie(JSON.stringify(sumAllKey), 'Ключевые показатели');
//hcWdl(JSON.stringify(sum30DaysSO), '');
//hcPie(JSON.stringify(sumMonthPoint), '');
//hcInverted(JSON.stringify(), '');


</script>

<style>
.hc-line {
	display: inline-block;
}
</style>
@stop