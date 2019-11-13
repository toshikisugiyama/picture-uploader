<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RegisterApiTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function shoule_新しいユーザーを作成して返却する()
    {
        $data = [
            'name' => 'photo upload user',
            'email' => 'test@email.com',
            'password' => 'test1234',
            'password_confirmation' => 'test1234',
        ];
        $response = $this->json('POST',route('register'), $data);
        $user = User::first();
        $this->assertEquals($data['name'],$user->name);

        $response->assertStatus(201)->assertJson(['name' => $user->name]);
    }
}
