<table class="table table-bordered table-striped">
	<thead>
		<th>Сентябрь</th>
		<th>Октябрь</th>
		<th>Ноябрь</th>
		<th>Декабрь</th>
		<th>Январь</th>
		<th>Февраль</th>
		<th>Коэфф вариации</th>
	</thead>
	<tbody>
	<tr>
	@foreach($items as $val)
		<td>{{ $val }}</td>
	@endforeach
	</tr>
	</tbody>
</table>

<h4>XYZ - {{ $xyz }}%</h4>