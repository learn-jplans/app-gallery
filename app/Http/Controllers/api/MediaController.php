<?php namespace App\Http\Controllers\api;
use App\Http\Controllers\Controller;
use Request;
use Input;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class MediaController extends Controller {

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function store()
	{

	    if (Input::hasFile('media')) {
	        $file            = Input::file('media');
	        $destinationPath = public_path().'/media/images/';
	        $filename        = str_random(6) . '_' . $file->getClientOriginalName();
	        $uploadSuccess   = $file->move($destinationPath, $filename);

	        return response()->json([
				'file' => $file,
				'status' => $uploadSuccess
			]);

	    } else {
	    	return response()->json([
				'status' => 'failed'
			]);
	    }
		
	}

}
