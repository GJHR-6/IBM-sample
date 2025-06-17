/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransferContract extends Contract {

    async assetTransferExists(ctx, assetTransferId) {
        const buffer = await ctx.stub.getState(assetTransferId);
        return (!!buffer && buffer.length > 0);
    }

    async createAssetTransfer(ctx, assetTransferId, value) {
        const exists = await this.assetTransferExists(ctx, assetTransferId);
        if (exists) {
            throw new Error(`The asset transfer ${assetTransferId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(assetTransferId, buffer);
    }

    async readAssetTransfer(ctx, assetTransferId) {
        const exists = await this.assetTransferExists(ctx, assetTransferId);
        if (!exists) {
            throw new Error(`The asset transfer ${assetTransferId} does not exist`);
        }
        const buffer = await ctx.stub.getState(assetTransferId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateAssetTransfer(ctx, assetTransferId, newValue) {
        const exists = await this.assetTransferExists(ctx, assetTransferId);
        if (!exists) {
            throw new Error(`The asset transfer ${assetTransferId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(assetTransferId, buffer);
    }

    async deleteAssetTransfer(ctx, assetTransferId) {
        const exists = await this.assetTransferExists(ctx, assetTransferId);
        if (!exists) {
            throw new Error(`The asset transfer ${assetTransferId} does not exist`);
        }
        await ctx.stub.deleteState(assetTransferId);
    }

}

module.exports = AssetTransferContract;
