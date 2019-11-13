<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class LoginApiTest extends TestCase
{
    use RefreshDatabase;

    public function setup()
    {
        parent::setup();
        $this->user = factory(User::class)->create();
    }

    /**
     * @test
     */
    public function should_登録済みのユーザーを認証して返却する()
    {
        $response = $this->json('POST', route('login'),[
            'email' => $this->user->email,
            'password' => 'secret'
        ]);

        $response->assertStatus(200)->assertJson(['name' => $this->user->name]);
        $this->assertAuthenticatedAs($this->user);
    }
}
