<?php

namespace App\Http\Controllers;

use App\Photo;
use Illuminate\Http\Request;
use App\Http\Requests\StorePhoto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    public function __construct()
    {
        // 認証が必要
        $this->middleware('auth')->except(['index', 'download']);
    }

    /**
     * 写真ダウンロード
     * @param Photo $photo
     * @return \Illuminate\Http\Response
     */
    public function download(Photo $photo)
    {
        // 写真の存在チェック
        if (! Storage::cloud()->exists($photo->filename)) {
            abort(404);
        }
        $headers = [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="'.$photo->filename.'"',
        ];
        return response(Storage::cloud()->get($photo->filename), 200, $headers);
    }

    /**
     * Display a listing of the resource.
     * 写真一覧
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $photos = Photo::with(['owner'])->orderBy(Photo::CREATED_AT, 'desc')->paginate();
        return $photos;
    }

    /**
     * Show the form for creating a new resource.
     * @param StorePhoto $request
     * @return \Illuminate\Http\Response
     */
    public function create(StorePhoto $request)
    {
        // 投稿写真の拡張子を取得する
        $extension = $request->photo->extension();
        $photo = new Photo();
        // ランダムな値と拡張子を組み合わせてファイル名にする
        $photo->filename = $photo->id . '.' . $extension;
        // s3にファイルを公開状態で保存する
        Storage::cloud()->putFileAs('', $request->photo, $photo->filename, 'public');
        // DBエラー時にファイル削除を行うため、トランザクションを利用する
        DB::beginTransaction();

        try {
            Auth::user()->photos()->save($photo);
            DB::commit();
        } catch(\Exception $exception) {
            DB::rollBack();
            // DBとの不整合を避けるためアップロードしたファイルを削除
            Storage::cloud()->delete($photo->filename);
            throw $exception;
        }
        // リソースの新規作成なのでレスポンスコードは201(CREATED)を返却する
        return response($photo, 201);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Photo  $photo
     * @return \Illuminate\Http\Response
     */
    public function show(Photo $photo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Photo  $photo
     * @return \Illuminate\Http\Response
     */
    public function edit(Photo $photo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Photo  $photo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Photo $photo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Photo  $photo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Photo $photo)
    {
        //
    }
}
