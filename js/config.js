/* Supabase 연결 정보. Project Settings → API 에서 복사해 넣어요.
   anon(공개) 키는 앱에 들어가도 되는 키예요. service_role(secret) 키는 절대 넣지 마세요. */
window.TOURDY_CONFIG = {
  supabaseUrl: 'https://vslebhksfeffqpghiocx.supabase.co',        // 예: 'https://abcdefghijklmnop.supabase.co'
  supabaseAnonKey: 'sb_publishable_Y69NflQ2gVRTtCCqateFGw_VSVQzFBd',    // 예: 'eyJhbGciOi...' 또는 'sb_publishable_...'
  nativeScheme: 'com.monoclesoftware.tourdy' // 아이폰 앱 로그인 후 돌아오는 주소 = 번들 ID (Xcode URL Types와 Supabase Redirect URLs에도 같은 값)
};
