<?php namespace App\Http\Controllers;
use Input;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class HomeController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| Home Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders your application's "dashboard" for users that
	| are authenticated. Of course, you are free to change or remove the
	| controller as you wish. It is just here to get your app started!
	|
	*/

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	// public function __construct()
	// {
	// 	$this->middleware('auth');
	// }

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function index()
	{
		return view('pages.home');
	}
	public function uploadform()
	{
		return view('pages.upload-form');
	}
	public function upload()
	{
		// try {
		// 	$file            = Input::file('media');
	 //        $destinationPath = public_path().'/media/images/';
	 //        $filename        = str_random(6) . '_' . $file->getClientOriginalName();
	 //        $bytes = File::size($file);
	 //        echo $bytes;
	 //        $uploadSuccess   = $file->move($destinationPath, $filename);
		// } catch (Exception $e) {
		// 	echo 'Caught exception: ',  $e->getMessage(), "\n";
		// }
		
		// if (Input::hasFile('media')) {
	        // $file            = Input::file('media');
	        // $destinationPath = public_path().'/media/images/';
	        // $filename        = str_random(6) . '_' . $file->getClientOriginalName();
	        // $uploadSuccess   = $file->move($destinationPath, $filename);
	        try {
		        $file = Input::file('media');
				$extension = $file->getClientOriginalExtension();
				$upload = Storage::disk('local')->put('media/images/'.$file->getFilename().'.'.$extension,  File::get($file));
				echo $upload;
	        } catch (Exception $e) {
	        	echo 'Caught exception: ',  $e->getMessage(), "\n";	
	        }
	        

	  //       return response()->json([
			// 	'file' => $file,
			// 	'status' => $upload
			// ]);

	  //   } else {
	  //   	return response()->json([
			// 	'status' => 'failed'
			// ]);
	  //   }
	}
}
