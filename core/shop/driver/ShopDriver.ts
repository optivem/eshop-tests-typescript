import type { Result } from '@optivem/commons/util';
import type { AsyncCloseable } from '@optivem/commons/util';
import type { Optional } from '@optivem/commons/util';
import type { SystemError } from '@optivem/driver-api/shop/driver/dtos/errors/SystemError.js';
import type { PlaceOrderRequest } from '@optivem/driver-api/shop/driver/dtos/PlaceOrderRequest.js';
import type { PlaceOrderResponse } from '@optivem/driver-api/shop/driver/dtos/PlaceOrderResponse.js';
import type { ViewOrderResponse } from '@optivem/driver-api/shop/driver/dtos/ViewOrderResponse.js';
import type { PublishCouponRequest } from '@optivem/driver-api/shop/driver/dtos/PublishCouponRequest.js';
import type { BrowseCouponsResponse } from '@optivem/driver-api/shop/driver/dtos/BrowseCouponsResponse.js';

export interface ShopDriver extends AsyncCloseable {
    goToShop(): Promise<Result<void, SystemError>>;
    placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, SystemError>>;
    cancelOrder(orderNumber: Optional<string>): Promise<Result<void, SystemError>>;
    viewOrder(orderNumber: Optional<string>): Promise<Result<ViewOrderResponse, SystemError>>;
    publishCoupon(request: PublishCouponRequest): Promise<Result<void, SystemError>>;
    browseCoupons(): Promise<Result<BrowseCouponsResponse, SystemError>>;
}

