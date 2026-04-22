import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log('Testing upload to bucket "gallery"...');
  
  const dummyBuffer = Buffer.from('test-image-content');
  const filename = `test-${Date.now()}.txt`;

  const { data, error } = await supabase.storage
    .from('gallery')
    .upload(filename, dummyBuffer, {
      contentType: 'text/plain',
      upsert: true
    });

  if (error) {
    console.error('❌ Upload failed:', error.message);
    if (error.message.includes('not found')) {
      console.log('👉 Tip: The bucket "gallery" might not exist yet.');
    } else if (error.message.includes('Permission denied') || error.message.includes('new row violates row-level security')) {
      console.log('👉 Tip: You need to add a "Storage Policy" in Supabase to allow uploads.');
    }
  } else {
    console.log('✅ Upload successful!', data);
    
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filename);
      
    console.log('🔗 Public URL:', publicUrl);
  }
}

testUpload();
