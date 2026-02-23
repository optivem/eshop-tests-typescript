import { Integer, type Optional, type Result } from '@optivem/commons/util';
import type { ShopUiClient } from '@optivem/core/shop/client/ui/ShopUiClient.js';
import { NewOrderPage } from '@optivem/core/shop/client/ui/pages/NewOrderPage.js';
import type { PlaceOrderRequest, PlaceOrderResponse, ViewOrderResponse } from '@optivem/core/shop/commons/dtos/orders/index.js';
import type { SystemError } from '@optivem/core/shop/commons/dtos/errors/SystemError.js';
import { failure, failureWithError, success } from '@optivem/core/shop/commons/SystemResults.js';

export async function placeOrderUsingUiClient(
    shopUiClient: ShopUiClient,
    request: PlaceOrderRequest
): Promise<Result<PlaceOrderResponse, SystemError>> {
    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();

    await newOrderPage.inputSku(request.sku);
    await newOrderPage.inputQuantity(request.quantity);
    await newOrderPage.inputCountry(request.country);
    await newOrderPage.inputCouponCode(request.couponCode);
    await newOrderPage.clickPlaceOrder();

    const result = await newOrderPage.getResult();
    if (result.isFailure()) {
        return failureWithError(result.getError());
    }

    const orderNumber = NewOrderPage.getOrderNumber(result.getValue());
    return success({ orderNumber });
}

export async function viewOrderUsingUiClient(
    shopUiClient: ShopUiClient,
    orderNumber: Optional<string>
): Promise<Result<ViewOrderResponse, SystemError>> {
    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const orderHistoryPage = await homePage.clickOrderHistory();

    await orderHistoryPage.inputOrderNumber(orderNumber);
    await orderHistoryPage.clickSearch();

    const isOrderListed = await orderHistoryPage.waitForOrderRow(orderNumber);
    if (!isOrderListed) {
        return failure(`Order ${orderNumber} does not exist.`);
    }

    const orderDetailsPage = await orderHistoryPage.clickViewOrderDetails(orderNumber);
    const isLoaded = await orderDetailsPage.isLoadedSuccessfully();
    if (!isLoaded) {
        return failure('Order details did not load');
    }

    const viewOrder = {
        orderNumber: await orderDetailsPage.getOrderNumber(),
        orderTimestamp: await orderDetailsPage.getOrderTimestamp(),
        sku: await orderDetailsPage.getSku(),
        quantity: Integer.fromNumber(await orderDetailsPage.getQuantity()),
        country: await orderDetailsPage.getCountry(),
        unitPrice: await orderDetailsPage.getUnitPrice(),
        basePrice: await orderDetailsPage.getBasePrice(),
        discountRate: await orderDetailsPage.getDiscountRate(),
        discountAmount: await orderDetailsPage.getDiscountAmount(),
        subtotalPrice: await orderDetailsPage.getSubtotalPrice(),
        taxRate: await orderDetailsPage.getTaxRate(),
        taxAmount: await orderDetailsPage.getTaxAmount(),
        totalPrice: await orderDetailsPage.getTotalPrice(),
        status: await orderDetailsPage.getStatus(),
        appliedCouponCode: await orderDetailsPage.getAppliedCoupon(),
    };

    return success(viewOrder);
}
