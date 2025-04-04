import { ICP_NETWORK } from '$env/networks/networks.icp.env';
import { DEPRECATED_SNES } from '$env/tokens/tokens.sns.deprecated.env';
import type { LedgerCanisterIdText } from '$icp/types/canister';
import type { IcCkInterface, IcFee, IcInterface, IcToken } from '$icp/types/ic-token';
import type { IcTokenWithoutIdExtended, IcrcCustomToken } from '$icp/types/icrc-custom-token';
import type { CanisterIdText } from '$lib/types/canister';
import type { TokenCategory, TokenMetadata } from '$lib/types/token';
import {
	IcrcMetadataResponseEntries,
	mapTokenMetadata,
	type IcrcTokenMetadataResponse,
	type IcrcValue
} from '@dfinity/ledger-icrc';
import { isNullish, nonNullish, notEmptyString } from '@dfinity/utils';

export type IcrcLoadData = Omit<IcInterface, 'explorerUrl'> & {
	metadata: IcrcTokenMetadataResponse;
	category: TokenCategory;
	icrcCustomTokens?: Record<LedgerCanisterIdText, IcTokenWithoutIdExtended>;
};

export const mapIcrcToken = ({
	metadata,
	icrcCustomTokens,
	ledgerCanisterId,
	...rest
}: IcrcLoadData): IcTokenWithoutIdExtended | undefined => {
	const token = mapOptionalToken(metadata);

	if (isNullish(token)) {
		return undefined;
	}

	const { symbol, icon: tokenIcon, ...metadataToken } = token;

	const icon = icrcCustomTokens?.[ledgerCanisterId]?.icon ?? tokenIcon;

	return {
		network: ICP_NETWORK,
		standard: 'icrc',
		symbol,
		...(notEmptyString(icon) && { icon }),
		...(nonNullish(icrcCustomTokens?.[ledgerCanisterId]?.explorerUrl) && {
			explorerUrl: icrcCustomTokens[ledgerCanisterId].explorerUrl
		}),
		...(nonNullish(icrcCustomTokens?.[ledgerCanisterId]?.alternativeName) && {
			alternativeName: icrcCustomTokens[ledgerCanisterId].alternativeName
		}),
		ledgerCanisterId,
		...metadataToken,
		...rest
	};
};

type IcrcTokenMetadata = TokenMetadata & IcFee;

const mapOptionalToken = (response: IcrcTokenMetadataResponse): IcrcTokenMetadata | undefined =>
	mapTokenMetadata(response);

// eslint-disable-next-line local-rules/prefer-object-params -- This is a sorting function, so the parameters will be provided not as an object but as separate arguments.
export const sortIcTokens = (
	{ name: nameA, position: positionA, exchangeCoinId: exchangeCoinIdA }: IcToken,
	{ name: nameB, position: positionB, exchangeCoinId: exchangeCoinIdB }: IcToken
) =>
	positionA === positionB
		? exchangeCoinIdA === exchangeCoinIdB ||
			isNullish(exchangeCoinIdA) ||
			isNullish(exchangeCoinIdB)
			? nameA.localeCompare(nameB)
			: exchangeCoinIdA.localeCompare(exchangeCoinIdB)
		: positionA - positionB;

export const buildIcrcCustomTokenMetadataPseudoResponse = ({
	icrcCustomTokens,
	ledgerCanisterId
}: {
	ledgerCanisterId: CanisterIdText;
	icrcCustomTokens: Record<LedgerCanisterIdText, IcTokenWithoutIdExtended>;
}): IcrcTokenMetadataResponse | undefined => {
	const token = icrcCustomTokens[ledgerCanisterId];

	if (isNullish(token)) {
		return undefined;
	}

	const { symbol, icon: tokenIcon, name, fee, decimals } = token;

	const icon: [IcrcMetadataResponseEntries.LOGO, IcrcValue] | undefined = nonNullish(tokenIcon)
		? [IcrcMetadataResponseEntries.LOGO, { Text: tokenIcon }]
		: undefined;

	return [
		[IcrcMetadataResponseEntries.SYMBOL, { Text: symbol }],
		[IcrcMetadataResponseEntries.NAME, { Text: name }],
		[IcrcMetadataResponseEntries.FEE, { Nat: fee }],
		[IcrcMetadataResponseEntries.DECIMALS, { Nat: BigInt(decimals) }],
		...(nonNullish(icon) ? [icon] : [])
	];
};

export const icTokenIcrcCustomToken = (token: Partial<IcrcCustomToken>): token is IcrcCustomToken =>
	(token.standard === 'icp' || token.standard === 'icrc') && 'enabled' in token;

const isIcCkInterface = (token: IcInterface): token is IcCkInterface =>
	'minterCanisterId' in token && 'twinToken' in token;

export const mapTokenOisyName = (token: IcInterface): IcInterface => ({
	...token,
	...(isIcCkInterface(token) && nonNullish(token.twinToken)
		? {
				oisyName: {
					prefix: 'ck',
					oisyName: token.twinToken.name
				}
			}
		: {})
});

export const isDeprecatedSns = ({ ledgerCanisterId }: Pick<IcToken, 'ledgerCanisterId'>): boolean =>
	ledgerCanisterId in DEPRECATED_SNES;

export const isNotDeprecatedSns = ({
	ledgerCanisterId
}: Pick<IcToken, 'ledgerCanisterId'>): boolean => !isDeprecatedSns({ ledgerCanisterId });
