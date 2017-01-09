<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class ItemsRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'barcode' => 'required|size:13',
            'name' => 'required',
            'price' => 'required|numeric',
        ];
    }
}
