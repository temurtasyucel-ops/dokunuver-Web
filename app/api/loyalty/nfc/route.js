import {database} from '../../../../lib/panel-server.js';
import {handleNfcClaim} from '../../../../lib/loyalty-nfc-handler.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const POST=request=>handleNfcClaim(request,{database});
