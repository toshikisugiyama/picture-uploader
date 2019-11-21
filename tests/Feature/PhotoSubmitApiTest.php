<?php

namespace Tests\Feature;

use App\Photo;
use App\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class PhotoSubmitApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = factory(User::class)->create();
    }

    /**
     * @test
     */
    public function should_ファイルをアップロードできる()
    {
        Storage::fake('s3');
        $response = $this->actingAs($this->user)->json('POST', route('photo.create'), [
            'photo' => UploadedFile::fake()->image('photo.jpg')
        ]);
        $response->assertStatus(201);
        $photo = Photo::first();
        $this->assertRegExp('/^[0-9a-zA-Z-_]{12}$/', $photo->id);
        Storage::cloud()->assertExists($photo->filename);
    }
    /**
     * @test
     */
    public function should_データベースエラーの場合はファイルを保存しない()
    {
        Schema::drop('photos');
        Storage::fake('s3');
        $response = $this->actingAs($this->user)->json('POST', route('photo.create'), [
            'photo' => UploadedFile::fake()->image('photo.jpg'),
        ]);
        $response->assertStatus(500);
        $this->assertEquals(0, count(Storage::cloud()->files));
    }

    /**
     * @test
     */
    public function should_ファイル保存エラーの場合はDBへの挿入はしない()
    {
        Storage::shouldRecieve('cloud')->once()->andReturnNull();
        $response = $this->actingAs($this->user)->json('POST', route('photo.create'), [
            'photo' => UploadedFile::fake()->image('photo.jpg'),
        ]);
        $response->assertStatus(500);
        $this->assertEmpty(Photo::all());
    }
}
