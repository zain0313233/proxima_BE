const {createClient} = require('@supabase/supabase-js');

const subpasurl=process.env.SUPABASE_URL;
const subpaskey=process.env.SUPABASE_KEY;

if(!subpasurl || !subpaskey) {
    throw new Error('Supabase URL and Key must be provided');
}
const subpass =createClient(subpasurl, subpaskey);
module.exports = subpass;