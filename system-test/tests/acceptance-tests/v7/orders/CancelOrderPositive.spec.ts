/**
 * V7 acceptance: cancel order (positive). Migrated from Java CancelOrderPositiveTest.
 */
import '../../../../setup-config.js';
import { Channel } from '../base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-api/shop/dtos/OrderStatus.js';

Channel(ChannelType.UI, ChannelType.API)('should have cancelled status when cancelled', async ({ scenario }) => {
    await scenario
        .given().order()
        .when().cancelOrder()
        .then().shouldSucceed()
        .and().order()
            .hasStatus(OrderStatus.CANCELLED);
});

