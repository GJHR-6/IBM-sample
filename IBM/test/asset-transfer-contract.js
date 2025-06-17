/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { AssetTransferContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('AssetTransferContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new AssetTransferContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"asset transfer 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"asset transfer 1002 value"}'));
    });

    describe('#assetTransferExists', () => {

        it('should return true for a asset transfer', async () => {
            await contract.assetTransferExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a asset transfer that does not exist', async () => {
            await contract.assetTransferExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createAssetTransfer', () => {

        it('should create a asset transfer', async () => {
            await contract.createAssetTransfer(ctx, '1003', 'asset transfer 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"asset transfer 1003 value"}'));
        });

        it('should throw an error for a asset transfer that already exists', async () => {
            await contract.createAssetTransfer(ctx, '1001', 'myvalue').should.be.rejectedWith(/The asset transfer 1001 already exists/);
        });

    });

    describe('#readAssetTransfer', () => {

        it('should return a asset transfer', async () => {
            await contract.readAssetTransfer(ctx, '1001').should.eventually.deep.equal({ value: 'asset transfer 1001 value' });
        });

        it('should throw an error for a asset transfer that does not exist', async () => {
            await contract.readAssetTransfer(ctx, '1003').should.be.rejectedWith(/The asset transfer 1003 does not exist/);
        });

    });

    describe('#updateAssetTransfer', () => {

        it('should update a asset transfer', async () => {
            await contract.updateAssetTransfer(ctx, '1001', 'asset transfer 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"asset transfer 1001 new value"}'));
        });

        it('should throw an error for a asset transfer that does not exist', async () => {
            await contract.updateAssetTransfer(ctx, '1003', 'asset transfer 1003 new value').should.be.rejectedWith(/The asset transfer 1003 does not exist/);
        });

    });

    describe('#deleteAssetTransfer', () => {

        it('should delete a asset transfer', async () => {
            await contract.deleteAssetTransfer(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a asset transfer that does not exist', async () => {
            await contract.deleteAssetTransfer(ctx, '1003').should.be.rejectedWith(/The asset transfer 1003 does not exist/);
        });

    });

});
