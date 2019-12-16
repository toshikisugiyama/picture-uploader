<?php

namespace Tests\Feature;

use App\User;
use App\Photo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AddCommentApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        // テストユーザー作成
        $this->user = factory(User::class)->create();
    }

    /**
     * @test
     */
    public function should_コメントを追加できる()
    {
        factory(Photo::class)->create();
        $photo = Photo::first();
        $content = 'sample content';
        $response = $this
            ->actingAs($this->user)
            ->json('POST', route('photo.comment', [
                'photo' => $photo->id,
            ]), compact('content'));
        $comments = $photo->comments()->get();
        $response->assertStatus(201)
                ->assertJsonFragment([
                    'author' => [
                        'name' => $this->user->name,
                    ],
                    'content' => $content,
                ]);
        $this->assertEquals(1, $comments->count());
        $this->assertEquals($content, $comments[0]->content);
    }
}
