/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  PythOracle,
  PythOracleInterface,
} from "../../../contracts/oracles/PythOracle";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IPyth",
        name: "underlyingPythOracle_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newPythOracle",
        type: "address",
      },
    ],
    name: "PythOracleSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "vToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "pythId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "maxStalePeriod",
        type: "uint64",
      },
    ],
    name: "TokenConfigAdded",
    type: "event",
  },
  {
    inputs: [],
    name: "EXP_SCALE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "vToken",
        type: "address",
      },
    ],
    name: "getUnderlyingPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "pythId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "vToken",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "maxStalePeriod",
            type: "uint64",
          },
        ],
        internalType: "struct TokenConfig",
        name: "tokenConfig",
        type: "tuple",
      },
    ],
    name: "setTokenConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "pythId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "vToken",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "maxStalePeriod",
            type: "uint64",
          },
        ],
        internalType: "struct TokenConfig[]",
        name: "tokenConfigs_",
        type: "tuple[]",
      },
    ],
    name: "setTokenConfigs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IPyth",
        name: "underlyingPythOracle_",
        type: "address",
      },
    ],
    name: "setUnderlyingPythOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tokenConfigs",
    outputs: [
      {
        internalType: "bytes32",
        name: "pythId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "vToken",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "maxStalePeriod",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "underlyingPythOracle",
    outputs: [
      {
        internalType: "contract IPyth",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610f2d380380610f2d83398101604081905261002f9161013a565b610038336100ea565b6001600160a01b03811661009d5760405162461bcd60e51b815260206004820152602260248201527f70797468206f7261636c652063616e6e6f74206265207a65726f206164647265604482015261737360f01b606482015260840160405180910390fd5b600180546001600160a01b0319166001600160a01b0383169081179091556040517fad50c6353c28bb4c67268a71d1f313fc9630fd4a91a6f3185270ba60a28710c190600090a25061016a565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561014c57600080fd5b81516001600160a01b038116811461016357600080fd5b9392505050565b610db4806101796000396000f3fe608060405234801561001057600080fd5b50600436106100be5760003560e01c80638da5cb5b11610076578063eb8bee701161005b578063eb8bee70146101c1578063f2fde38b146101d4578063fc57d4df146101e757600080fd5b80638da5cb5b14610193578063bbba205d146101a457600080fd5b80636a8c7d35116100a75780636a8c7d3514610163578063703ae1b914610178578063715018a61461018b57600080fd5b80631b69dc5f146100c357806356fa5a5614610138575b600080fd5b6101066100d13660046109d4565b600260205260009081526040902080546001909101546001600160a01b03811690600160a01b900467ffffffffffffffff1683565b604080519384526001600160a01b03909216602084015267ffffffffffffffff16908201526060015b60405180910390f35b60015461014b906001600160a01b031681565b6040516001600160a01b03909116815260200161012f565b610176610171366004610ac2565b6101fa565b005b6101766101863660046109d4565b6102ee565b6101766103f7565b6000546001600160a01b031661014b565b6101b3670de0b6b3a764000081565b60405190815260200161012f565b6101766101cf366004610b72565b61045d565b6101766101e23660046109d4565b61060f565b6101b36101f53660046109d4565b6106f1565b6000546001600160a01b031633146102595760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b80516000036102aa5760405162461bcd60e51b815260206004820152601160248201527f6c656e6774682063616e277420626520300000000000000000000000000000006044820152606401610250565b60005b81518110156102ea576102d88282815181106102cb576102cb610b8e565b602002602001015161045d565b806102e281610bba565b9150506102ad565b5050565b6000546001600160a01b031633146103485760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610250565b806001600160a01b03811661039f5760405162461bcd60e51b815260206004820152601560248201527f63616e2774206265207a65726f206164647265737300000000000000000000006044820152606401610250565b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0384169081179091556040517fad50c6353c28bb4c67268a71d1f313fc9630fd4a91a6f3185270ba60a28710c190600090a25050565b6000546001600160a01b031633146104515760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610250565b61045b60006108eb565b565b6000546001600160a01b031633146104b75760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610250565b60208101516001600160a01b0381166105125760405162461bcd60e51b815260206004820152601560248201527f63616e2774206265207a65726f206164647265737300000000000000000000006044820152606401610250565b816040015167ffffffffffffffff166000036105705760405162461bcd60e51b815260206004820152601c60248201527f6d6178207374616c6520706572696f642063616e6e6f742062652030000000006044820152606401610250565b602082810180516001600160a01b03908116600090815260029093526040808420865180825593516001909101805483890151929094167fffffffff000000000000000000000000000000000000000000000000000000009094168417600160a01b67ffffffffffffffff909316928302179055905190937f559091caed5aa983e358fdf18e8cefbc8ea71f64ea252477cf32778ae4c398b291a45050565b6000546001600160a01b031633146106695760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610250565b6001600160a01b0381166106e55760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610250565b6106ee816108eb565b50565b6001546000906001600160a01b031661074c5760405162461bcd60e51b815260206004820152601b60248201527f70797468206f7261636c65206973207a65726f206164647265737300000000006044820152606401610250565b6001600160a01b03808316600090815260026020526040902060018101549091166107b95760405162461bcd60e51b815260206004820152601460248201527f76546f6b656e20646f65736e27742065786973740000000000000000000000006044820152606401610250565b6001805482549183015460405163314a4d7f60e21b81526004810193909352600160a01b900467ffffffffffffffff1660248301526000916001600160a01b039091169063c52935fc90604401606060405180830381865afa158015610823573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108479190610bd3565b9050600061085b826000015160070b610948565b90506000826040015160030b13156108ac576108a3610880836040015160030b610948565b61088b90600a610d37565b61089d83670de0b6b3a764000061099e565b9061099e565b95945050505050565b6108a36108c883604001516108c090610d43565b60030b610948565b6108d390600a610d37565b6108e583670de0b6b3a764000061099e565b906109b3565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60008082121561099a5760405162461bcd60e51b815260206004820181905260248201527f53616665436173743a2076616c7565206d75737420626520706f7369746976656044820152606401610250565b5090565b60006109aa8284610d66565b90505b92915050565b60006109aa8284610d85565b6001600160a01b03811681146106ee57600080fd5b6000602082840312156109e657600080fd5b81356109f1816109bf565b9392505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff81118282101715610a3757610a376109f8565b604052919050565b67ffffffffffffffff811681146106ee57600080fd5b600060608284031215610a6757600080fd5b6040516060810181811067ffffffffffffffff82111715610a8a57610a8a6109f8565b604052823581529050806020830135610aa2816109bf565b60208201526040830135610ab581610a3f565b6040919091015292915050565b60006020808385031215610ad557600080fd5b823567ffffffffffffffff80821115610aed57600080fd5b818501915085601f830112610b0157600080fd5b813581811115610b1357610b136109f8565b610b21848260051b01610a0e565b81815284810192506060918202840185019188831115610b4057600080fd5b938501935b82851015610b6657610b578986610a55565b84529384019392850192610b45565b50979650505050505050565b600060608284031215610b8457600080fd5b6109aa8383610a55565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060018201610bcc57610bcc610ba4565b5060010190565b600060608284031215610be557600080fd5b6040516060810181811067ffffffffffffffff82111715610c0857610c086109f8565b6040528251600781900b8114610c1d57600080fd5b81526020830151610c2d81610a3f565b60208201526040830151600381900b8114610c4757600080fd5b60408201529392505050565b600181815b80851115610c8e578160001904821115610c7457610c74610ba4565b80851615610c8157918102915b93841c9390800290610c58565b509250929050565b600082610ca5575060016109ad565b81610cb2575060006109ad565b8160018114610cc85760028114610cd257610cee565b60019150506109ad565b60ff841115610ce357610ce3610ba4565b50506001821b6109ad565b5060208310610133831016604e8410600b8410161715610d11575081810a6109ad565b610d1b8383610c53565b8060001904821115610d2f57610d2f610ba4565b029392505050565b60006109aa8383610c96565b60008160030b637fffffff198103610d5d57610d5d610ba4565b60000392915050565b6000816000190483118215151615610d8057610d80610ba4565b500290565b600082610da257634e487b7160e01b600052601260045260246000fd5b50049056fea164736f6c634300080d000a";

type PythOracleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PythOracleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PythOracle__factory extends ContractFactory {
  constructor(...args: PythOracleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    underlyingPythOracle_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<PythOracle> {
    return super.deploy(
      underlyingPythOracle_,
      overrides || {}
    ) as Promise<PythOracle>;
  }
  override getDeployTransaction(
    underlyingPythOracle_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(underlyingPythOracle_, overrides || {});
  }
  override attach(address: string): PythOracle {
    return super.attach(address) as PythOracle;
  }
  override connect(signer: Signer): PythOracle__factory {
    return super.connect(signer) as PythOracle__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PythOracleInterface {
    return new utils.Interface(_abi) as PythOracleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PythOracle {
    return new Contract(address, _abi, signerOrProvider) as PythOracle;
  }
}
