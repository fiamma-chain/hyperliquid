import * as v from "valibot";

// ============================================================
// API Schemas
// ============================================================

import { Address, UnsignedInteger } from "../_base.ts";
import {
  createL1ActionParams,
  ErrorResponse,
  L1ActionParams,
  Signature,
  SuccessResponse,
} from "./_base/mod.ts";

/**
 * Update cross or isolated leverage on a coin.
 * @see https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint#update-leverage
 */
export const UpdateLeverageRequest = /* @__PURE__ */ (() => {
  return v.pipe(
    v.object({
      /** Action to perform. */
      action: v.pipe(
        v.object({
          /** Type of action. */
          type: v.pipe(
            v.literal("updateLeverage"),
            v.description("Type of action."),
          ),
          /** Asset ID. */
          asset: v.pipe(
            UnsignedInteger,
            v.description("Asset ID."),
          ),
          /** `true` for cross leverage, `false` for isolated leverage. */
          isCross: v.pipe(
            v.boolean(),
            v.description("`true` for cross leverage, `false` for isolated leverage."),
          ),
          /** New leverage value. */
          leverage: v.pipe(
            v.pipe(UnsignedInteger, v.minValue(1)),
            v.description("New leverage value."),
          ),
        }),
        v.description("Action to perform."),
      ),
      /** Unique request identifier (current timestamp in ms). */
      nonce: v.pipe(
        UnsignedInteger,
        v.description("Unique request identifier (current timestamp in ms)."),
      ),
      /** Cryptographic signature. */
      signature: v.pipe(
        Signature,
        v.description("Cryptographic signature."),
      ),
      /** Vault address (for vault trading). */
      vaultAddress: v.pipe(
        v.optional(Address),
        v.description("Vault address (for vault trading)."),
      ),
      /** Expiration time of the action. */
      expiresAfter: v.pipe(
        v.optional(UnsignedInteger),
        v.description("Expiration time of the action."),
      ),
    }),
    v.description("Update cross or isolated leverage on a coin."),
  );
})();
export type UpdateLeverageRequest = v.InferOutput<typeof UpdateLeverageRequest>;

/**
 * Successful response without specific data or error response.
 * @see https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint#update-leverage
 */
export const UpdateLeverageResponse = /* @__PURE__ */ (() => {
  return v.pipe(
    v.union([SuccessResponse, ErrorResponse]),
    v.description("Successful response without specific data or error response."),
  );
})();
export type UpdateLeverageResponse = v.InferOutput<typeof UpdateLeverageResponse>;

// ============================================================
// Execution Logic
// ============================================================

import { type DeepImmutable, parser } from "../_base.ts";
import {
  type ExchangeRequestConfig,
  type ExcludeErrorResponse,
  executeL1Action,
  type ExtractRequestAction,
  type ExtractRequestOptions,
  type MultiSignRequestConfig,
} from "./_base/mod.ts";

/** Action parameters for the {@linkcode updateLeverage} function. */
export type UpdateLeverageParameters = ExtractRequestAction<v.InferInput<typeof UpdateLeverageRequest>>;

/** Request options for the {@linkcode updateLeverage} function. */
export type UpdateLeverageOptions = ExtractRequestOptions<v.InferInput<typeof UpdateLeverageRequest>>;

/** Successful variant of {@linkcode UpdateLeverageResponse} without errors. */
export type UpdateLeverageSuccessResponse = ExcludeErrorResponse<UpdateLeverageResponse>;

/**
 * Update cross or isolated leverage on a coin.
 * @param config - General configuration for Exchange API requests.
 * @param params - Parameters specific to the API request.
 * @param opts - Request execution options.
 * @returns Successful response without specific data.
 *
 * @throws {ApiRequestError} When the API returns an unsuccessful response.
 * @throws {TransportError} When the transport layer throws an error.
 *
 * @see https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint#update-leverage
 * @example
 * ```ts
 * import { HttpTransport } from "@nktkas/hyperliquid";
 * import { updateLeverage } from "@nktkas/hyperliquid/api/exchange";
 * import { privateKeyToAccount } from "viem/accounts";
 *
 * const wallet = privateKeyToAccount("0x..."); // viem or ethers
 * const transport = new HttpTransport(); // or `WebSocketTransport`
 *
 * await updateLeverage(
 *   { transport, wallet },
 *   { asset: 0, isCross: true, leverage: 5 },
 * );
 * ```
 */
export async function updateLeverage(
  config: ExchangeRequestConfig | MultiSignRequestConfig,
  params: DeepImmutable<UpdateLeverageParameters>,
  opts?: UpdateLeverageOptions,
): Promise<UpdateLeverageSuccessResponse> {
  const request = parser(UpdateLeverageRequest)({
    action: {
      type: "updateLeverage",
      ...params,
    },
    nonce: 0, // Placeholder; actual nonce generated in `executeL1Action`
    signature: { // Placeholder; actual signature generated in `executeL1Action`
      r: "0x0000000000000000000000000000000000000000000000000000000000000000",
      s: "0x0000000000000000000000000000000000000000000000000000000000000000",
      v: 27,
    },
    vaultAddress: opts?.vaultAddress ?? config.defaultVaultAddress,
    expiresAfter: typeof config.defaultExpiresAfter === "number"
      ? config.defaultExpiresAfter
      : await config.defaultExpiresAfter?.(),
  });
  console.log('[DEBUG] updateLeverage 请求数据:', JSON.stringify(request, null, 2));
  const response = await executeL1Action(config, request, opts?.signal);
  console.log('[DEBUG] updateLeverage 响应数据:', JSON.stringify(response, null, 2));
  return response as UpdateLeverageSuccessResponse;
}

/**
 * Create update leverage parameters.
 * @param config - General configuration for Exchange API requests.
 * @param params - Parameters specific to the API request.
 * @param opts - Request execution options.
 * @returns L1 action parameters.
 *
 * @throws {ApiRequestError} When the API returns an unsuccessful response.
 * @throws {TransportError} When the transport layer throws an error.
 *
 * @see https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint#update-leverage
 * @example
 * ```ts
 * import * as hl from "@nktkas/hyperliquid";
 *
 * const pk = "0x..."; // viem, ethers or private key
 * const transport = new hl.HttpTransport(); // or `WebSocketTransport`
 *
 * const client = new hl.ExchangeClient({ transport, wallet: pk });
 * const params = await client.createUpdateLeverageParams(
 *   { transport, wallet },
 *   { asset: 0, isCross: true, leverage: 5 },
 * );
 * ```
 */
export async function createUpdateLeverageParams(
  config: ExchangeRequestConfig | MultiSignRequestConfig,
  params: DeepImmutable<UpdateLeverageParameters>,
  opts?: UpdateLeverageOptions,
): Promise<L1ActionParams> {
  const request = parser(UpdateLeverageRequest)({
    action: {
      type: "updateLeverage",
      ...params,
    },
    nonce: 0, // Placeholder; actual nonce generated in `executeL1Action`
    signature: { // Placeholder; actual signature generated in `executeL1Action`
      r: "0x0000000000000000000000000000000000000000000000000000000000000000",
      s: "0x0000000000000000000000000000000000000000000000000000000000000000",
      v: 27,
    },
    vaultAddress: opts?.vaultAddress ?? config.defaultVaultAddress,
    expiresAfter: typeof config.defaultExpiresAfter === "number"
      ? config.defaultExpiresAfter
      : await config.defaultExpiresAfter?.(),
  });
  return await createL1ActionParams(config, request);
}
