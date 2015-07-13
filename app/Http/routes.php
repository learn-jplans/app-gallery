<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'HomeController@index');
Route::get('/form', 'HomeController@uploadform');
Route::post('/upload', 'HomeController@upload');
Route::group(['prefix' => 'api'], function(){
	Route::get('/', function(){
		return response()->json([
			'msg' => 'AppGallery api'
		]);
	});
	Route::resource('media','api\MediaController');
});

Route::get('dropzone', 'DropzoneController@index');
Route::post('dropzone/uploadFiles', 'DropzoneController@uploadFiles');
Route::get('gmap', 'GmapController@index');