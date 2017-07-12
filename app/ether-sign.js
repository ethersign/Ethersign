var crypto = require('crypto')
var eth_utils = require('ethereumjs-util');
 

		exports.connectToEthereumUsingProvider = function (_web3_provider)
		{

			const BN = require('bn.js');
			const HttpProvider = require('ethjs-provider-http');

			if(typeof _web3_provider == 'undefined')
			{
				_web3_provider = new HttpProvider('http://localhost:8545')
			}

			const Eth = require('ethjs-query');
			const eth = new Eth(_web3_provider);

			return eth;

		}



		//use web3 ethereum light client to verify that a cryptopunks is owned by a particular public address

		exports.verifyCryptopunkOwnedByPublicAddress = function (_eth, _punk_id,_eth_pub_addr)
		{
 			//IMPLEMENT ME

			var cryptopunks_contract_address = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"

			var result = _eth.getStorageAt() //?

		}



		//use web3 ethereum light client to return a list of cryptopunks at a public address

		exports.getCryptopunksAtPublicAddress = function (_eth_pub_addr)
		{

		}

		exports.getRandomCryptopunkAtPublicAddress = function (_eth_pub_addr)
		{

		}

		exports.getFirstCryptopunkAtPublicAddress = function (_eth_pub_addr)
		{

		}


		 //generate a challenge for the user to sign in order to prove ownership of their private key

		exports.generateEllipticCurveChallengeDigest = function (_secure_random_message)
		{

			if(typeof _secure_random_message == 'undefined')
			{
				var len = 32;

				_secure_random_message = crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
			}

			random_message_buffer = Buffer.from(_secure_random_message.toString())

			var new_ec_challenge_digest = eth_utils.hashPersonalMessage(random_message_buffer)

			return new_ec_challenge_digest;
		}


		//This function must be ran locally and offline by the holder of the private key that owns the cryptopunk
		//This function uses the private kay and random challenge to generate a signature proving ownership of the private key

	 	exports.signEllipticCurveChallenge = function (_eth_private_key,_challenge_digest)
		{

			private_key_buffer =  Buffer.from(_eth_private_key,'hex')

			var sig = eth_utils.ecsign(_challenge_digest,private_key_buffer)

			var rpc_format_sig = eth_utils.toRpcSig(sig.v,sig.r,sig.s)

			return rpc_format_sig;

		}


		exports.getPublicKeyFromEllipticCurveSignature = function (_challenge_digest,_signature_response_hex)
		{


			var vrs_data = eth_utils.fromRpcSig(_signature_response_hex)

			var public_key_from_sig = eth_utils.ecrecover(_challenge_digest,vrs_data.v,vrs_data.r,vrs_data.s)

			return public_key_from_sig;

		}

		//use ECDSA just like the official Eth repo uses where secure_random_challenge is a truly random string
		//If the proper signature response is given for the challenge, that means the signature was created by the owner of the private key for the public key

		exports.validateEllipticCurveSignature = function (_eth_pub_addr,_challenge_digest,_signature_response_hex)
		{


			var public_key_from_sig = getPublicKeyFromEllipticCurveSignature(_challenge_digest,_signature_response_hex)

			//verify that pub address matches pub key from the signature

			var public_key_valid = eth_utils.isValidPublic(public_key_from_sig)

			var public_address_from_sig = eth_utils.pubToAddress(public_key_from_sig)

			var address_matches = (public_address_from_sig === _eth_pub_addr)

			return {valid: address_matches, pub_addr: public_address_from_sig}
		}



		exports.verifyPublicAddressMatchesPublicKey = function (_eth_pub_addr,_eth_pub_key)
		{
			var address_at_pub_key = eth_utils.publicToAddress(_eth_pub_key);

			var address_at_pub_key_hex = eth_utils.addHexPrefix(address_at_pub_key.toString('hex'));


			return (address_at_pub_key_hex.toLowerCase() === _eth_pub_addr.toLowerCase())
		}


		exports.fixCryptopunkId = function (_icon_id)
		{
			while(_icon_id.length < 3)
			{
				_icon_id = "0" + _icon_id;
			}

			return _icon_id;
		}

		exports.getCryptopunkIconLocalImagePath = function (_icon_id)
		{
			_icon_id = exports.fixCryptopunkId(_icon_id)


			var fs = require('fs');
			var path = require('path');


			var assets_folder = path.join(path.dirname(fs.realpathSync(__filename)), '../app/assets');
			var icon_file_path =  (assets_folder + '/punk'+_icon_id+'.png');
			//var icon_file = fs.readFileSync(icon_file_path);

			return icon_file_path;
		}

		exports.getCryptopunkIconCentralizedURL = function (_icon_id)
		{
			_icon_id = exports.fixCryptopunkId(_icon_id)

			return "https://www.larvalabs.com/cryptopunks/cryptopunk"+_icon_id+".png"
		}
