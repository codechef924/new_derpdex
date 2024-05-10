import { MixedRouteSDK, Protocol, } from '@derpdex/router-sdk';
import { Route as V3RouteRaw, } from '@derpdex/sdk';
import { Route as V2RouteRaw } from '@uniswap/v2-sdk';
export class V3Route extends V3RouteRaw {
    constructor() {
        super(...arguments);
        this.protocol = Protocol.V3;
    }
}
export class V2Route extends V2RouteRaw {
    constructor() {
        super(...arguments);
        this.protocol = Protocol.V2;
    }
}
export class MixedRoute extends MixedRouteSDK {
    constructor() {
        super(...arguments);
        this.protocol = Protocol.MIXED;
    }
}
export var SwapToRatioStatus;
(function (SwapToRatioStatus) {
    SwapToRatioStatus[SwapToRatioStatus["SUCCESS"] = 1] = "SUCCESS";
    SwapToRatioStatus[SwapToRatioStatus["NO_ROUTE_FOUND"] = 2] = "NO_ROUTE_FOUND";
    SwapToRatioStatus[SwapToRatioStatus["NO_SWAP_NEEDED"] = 3] = "NO_SWAP_NEEDED";
})(SwapToRatioStatus || (SwapToRatioStatus = {}));
export var SwapType;
(function (SwapType) {
    SwapType[SwapType["UNIVERSAL_ROUTER"] = 0] = "UNIVERSAL_ROUTER";
    SwapType[SwapType["SWAP_ROUTER_02"] = 1] = "SWAP_ROUTER_02";
})(SwapType || (SwapType = {}));
/**
 * Provides functionality for finding optimal swap routes on the Uniswap protocol.
 *
 * @export
 * @abstract
 * @class IRouter
 */
export class IRouter {
}
export class ISwapToRatio {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcnMvcm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxhQUFhLEVBQ2IsUUFBUSxHQUVULE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUlMLEtBQUssSUFBSSxVQUFVLEdBQ3BCLE1BQU0sY0FBYyxDQUFDO0FBVXRCLE9BQU8sRUFBRSxLQUFLLElBQUksVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFPdEQsTUFBTSxPQUFPLE9BQVEsU0FBUSxVQUF3QjtJQUFyRDs7UUFDRSxhQUFRLEdBQWdCLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDdEMsQ0FBQztDQUFBO0FBQ0QsTUFBTSxPQUFPLE9BQVEsU0FBUSxVQUF3QjtJQUFyRDs7UUFDRSxhQUFRLEdBQWdCLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDdEMsQ0FBQztDQUFBO0FBQ0QsTUFBTSxPQUFPLFVBQVcsU0FBUSxhQUEyQjtJQUEzRDs7UUFDRSxhQUFRLEdBQW1CLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDNUMsQ0FBQztDQUFBO0FBZ0VELE1BQU0sQ0FBTixJQUFZLGlCQUlYO0FBSkQsV0FBWSxpQkFBaUI7SUFDM0IsK0RBQVcsQ0FBQTtJQUNYLDZFQUFrQixDQUFBO0lBQ2xCLDZFQUFrQixDQUFBO0FBQ3BCLENBQUMsRUFKVyxpQkFBaUIsS0FBakIsaUJBQWlCLFFBSTVCO0FBcUJELE1BQU0sQ0FBTixJQUFZLFFBR1g7QUFIRCxXQUFZLFFBQVE7SUFDbEIsK0RBQWdCLENBQUE7SUFDaEIsMkRBQWMsQ0FBQTtBQUNoQixDQUFDLEVBSFcsUUFBUSxLQUFSLFFBQVEsUUFHbkI7QUEwREQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFnQixPQUFPO0NBb0I1QjtBQUVELE1BQU0sT0FBZ0IsWUFBWTtDQVNqQyJ9