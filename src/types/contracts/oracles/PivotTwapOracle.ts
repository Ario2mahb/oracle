/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export type TokenConfigStruct = {
  vToken: PromiseOrValue<string>;
  baseUnit: PromiseOrValue<BigNumberish>;
  pancakePool: PromiseOrValue<string>;
  isBnbBased: PromiseOrValue<boolean>;
  isReversedPool: PromiseOrValue<boolean>;
  anchorPeriod: PromiseOrValue<BigNumberish>;
};

export type TokenConfigStructOutput = [
  string,
  BigNumber,
  string,
  boolean,
  boolean,
  BigNumber
] & {
  vToken: string;
  baseUnit: BigNumber;
  pancakePool: string;
  isBnbBased: boolean;
  isReversedPool: boolean;
  anchorPeriod: BigNumber;
};

export type ValidateConfigStruct = {
  vToken: PromiseOrValue<string>;
  upperBoundRatio: PromiseOrValue<BigNumberish>;
  lowerBoundRatio: PromiseOrValue<BigNumberish>;
};

export type ValidateConfigStructOutput = [string, BigNumber, BigNumber] & {
  vToken: string;
  upperBoundRatio: BigNumber;
  lowerBoundRatio: BigNumber;
};

export interface PivotTwapOracleInterface extends utils.Interface {
  functions: {
    "VBNB()": FunctionFragment;
    "bnbBaseUnit()": FunctionFragment;
    "busdBaseUnit()": FunctionFragment;
    "currentCumulativePrice((address,uint256,address,bool,bool,uint256))": FunctionFragment;
    "expScale()": FunctionFragment;
    "getUnderlyingPrice(address)": FunctionFragment;
    "newObservations(address)": FunctionFragment;
    "oldObservations(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "prices(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setTokenConfig((address,uint256,address,bool,bool,uint256))": FunctionFragment;
    "setTokenConfigs((address,uint256,address,bool,bool,uint256)[])": FunctionFragment;
    "setValidateConfig((address,uint256,uint256))": FunctionFragment;
    "setValidateConfigs((address,uint256,uint256)[])": FunctionFragment;
    "tokenConfigs(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateTwap(address)": FunctionFragment;
    "validateConfigs(address)": FunctionFragment;
    "validatePrice(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "VBNB"
      | "bnbBaseUnit"
      | "busdBaseUnit"
      | "currentCumulativePrice"
      | "expScale"
      | "getUnderlyingPrice"
      | "newObservations"
      | "oldObservations"
      | "owner"
      | "prices"
      | "renounceOwnership"
      | "setTokenConfig"
      | "setTokenConfigs"
      | "setValidateConfig"
      | "setValidateConfigs"
      | "tokenConfigs"
      | "transferOwnership"
      | "updateTwap"
      | "validateConfigs"
      | "validatePrice"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "VBNB", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "bnbBaseUnit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "busdBaseUnit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "currentCumulativePrice",
    values: [TokenConfigStruct]
  ): string;
  encodeFunctionData(functionFragment: "expScale", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getUnderlyingPrice",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "newObservations",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "oldObservations",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "prices",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenConfig",
    values: [TokenConfigStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenConfigs",
    values: [TokenConfigStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setValidateConfig",
    values: [ValidateConfigStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setValidateConfigs",
    values: [ValidateConfigStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenConfigs",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateTwap",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "validateConfigs",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "validatePrice",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "VBNB", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "bnbBaseUnit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "busdBaseUnit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentCumulativePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "expScale", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getUnderlyingPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "newObservations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "oldObservations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "prices", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenConfigs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setValidateConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setValidateConfigs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenConfigs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "updateTwap", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "validateConfigs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validatePrice",
    data: BytesLike
  ): Result;

  events: {
    "AnchorPriceUpdated(address,uint256,uint256,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "TokenConfigAdded(address,address,uint256)": EventFragment;
    "TwapWindowUpdated(address,uint256,uint256,uint256,uint256)": EventFragment;
    "ValidateConfigAdded(address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AnchorPriceUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenConfigAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TwapWindowUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ValidateConfigAdded"): EventFragment;
}

export interface AnchorPriceUpdatedEventObject {
  vToken: string;
  price: BigNumber;
  oldTimestamp: BigNumber;
  newTimestamp: BigNumber;
}
export type AnchorPriceUpdatedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  AnchorPriceUpdatedEventObject
>;

export type AnchorPriceUpdatedEventFilter =
  TypedEventFilter<AnchorPriceUpdatedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface TokenConfigAddedEventObject {
  vToken: string;
  pancakePool: string;
  anchorPeriod: BigNumber;
}
export type TokenConfigAddedEvent = TypedEvent<
  [string, string, BigNumber],
  TokenConfigAddedEventObject
>;

export type TokenConfigAddedEventFilter =
  TypedEventFilter<TokenConfigAddedEvent>;

export interface TwapWindowUpdatedEventObject {
  vToken: string;
  oldTimestamp: BigNumber;
  oldAcc: BigNumber;
  newTimestamp: BigNumber;
  newAcc: BigNumber;
}
export type TwapWindowUpdatedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, BigNumber],
  TwapWindowUpdatedEventObject
>;

export type TwapWindowUpdatedEventFilter =
  TypedEventFilter<TwapWindowUpdatedEvent>;

export interface ValidateConfigAddedEventObject {
  vToken: string;
  upperBound: BigNumber;
  lowerBound: BigNumber;
}
export type ValidateConfigAddedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  ValidateConfigAddedEventObject
>;

export type ValidateConfigAddedEventFilter =
  TypedEventFilter<ValidateConfigAddedEvent>;

export interface PivotTwapOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PivotTwapOracleInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    VBNB(overrides?: CallOverrides): Promise<[string]>;

    bnbBaseUnit(overrides?: CallOverrides): Promise<[BigNumber]>;

    busdBaseUnit(overrides?: CallOverrides): Promise<[BigNumber]>;

    currentCumulativePrice(
      config: TokenConfigStruct,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    expScale(overrides?: CallOverrides): Promise<[BigNumber]>;

    getUnderlyingPrice(
      vToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    newObservations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { timestamp: BigNumber; acc: BigNumber }
    >;

    oldObservations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { timestamp: BigNumber; acc: BigNumber }
    >;

    owner(overrides?: CallOverrides): Promise<[string]>;

    prices(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTokenConfig(
      config: TokenConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTokenConfigs(
      configs: TokenConfigStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setValidateConfig(
      config: ValidateConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setValidateConfigs(
      configs: ValidateConfigStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    tokenConfigs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, string, boolean, boolean, BigNumber] & {
        vToken: string;
        baseUnit: BigNumber;
        pancakePool: string;
        isBnbBased: boolean;
        isReversedPool: boolean;
        anchorPeriod: BigNumber;
      }
    >;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateTwap(
      vToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    validateConfigs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber] & {
        vToken: string;
        upperBoundRatio: BigNumber;
        lowerBoundRatio: BigNumber;
      }
    >;

    validatePrice(
      vToken: PromiseOrValue<string>,
      reporterPrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  VBNB(overrides?: CallOverrides): Promise<string>;

  bnbBaseUnit(overrides?: CallOverrides): Promise<BigNumber>;

  busdBaseUnit(overrides?: CallOverrides): Promise<BigNumber>;

  currentCumulativePrice(
    config: TokenConfigStruct,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  expScale(overrides?: CallOverrides): Promise<BigNumber>;

  getUnderlyingPrice(
    vToken: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  newObservations(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; acc: BigNumber }>;

  oldObservations(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; acc: BigNumber }>;

  owner(overrides?: CallOverrides): Promise<string>;

  prices(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTokenConfig(
    config: TokenConfigStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTokenConfigs(
    configs: TokenConfigStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setValidateConfig(
    config: ValidateConfigStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setValidateConfigs(
    configs: ValidateConfigStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  tokenConfigs(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, string, boolean, boolean, BigNumber] & {
      vToken: string;
      baseUnit: BigNumber;
      pancakePool: string;
      isBnbBased: boolean;
      isReversedPool: boolean;
      anchorPeriod: BigNumber;
    }
  >;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateTwap(
    vToken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  validateConfigs(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber] & {
      vToken: string;
      upperBoundRatio: BigNumber;
      lowerBoundRatio: BigNumber;
    }
  >;

  validatePrice(
    vToken: PromiseOrValue<string>,
    reporterPrice: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    VBNB(overrides?: CallOverrides): Promise<string>;

    bnbBaseUnit(overrides?: CallOverrides): Promise<BigNumber>;

    busdBaseUnit(overrides?: CallOverrides): Promise<BigNumber>;

    currentCumulativePrice(
      config: TokenConfigStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    expScale(overrides?: CallOverrides): Promise<BigNumber>;

    getUnderlyingPrice(
      vToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    newObservations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { timestamp: BigNumber; acc: BigNumber }
    >;

    oldObservations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { timestamp: BigNumber; acc: BigNumber }
    >;

    owner(overrides?: CallOverrides): Promise<string>;

    prices(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setTokenConfig(
      config: TokenConfigStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenConfigs(
      configs: TokenConfigStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    setValidateConfig(
      config: ValidateConfigStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    setValidateConfigs(
      configs: ValidateConfigStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    tokenConfigs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, string, boolean, boolean, BigNumber] & {
        vToken: string;
        baseUnit: BigNumber;
        pancakePool: string;
        isBnbBased: boolean;
        isReversedPool: boolean;
        anchorPeriod: BigNumber;
      }
    >;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateTwap(
      vToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    validateConfigs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber] & {
        vToken: string;
        upperBoundRatio: BigNumber;
        lowerBoundRatio: BigNumber;
      }
    >;

    validatePrice(
      vToken: PromiseOrValue<string>,
      reporterPrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "AnchorPriceUpdated(address,uint256,uint256,uint256)"(
      vToken?: PromiseOrValue<string> | null,
      price?: null,
      oldTimestamp?: null,
      newTimestamp?: null
    ): AnchorPriceUpdatedEventFilter;
    AnchorPriceUpdated(
      vToken?: PromiseOrValue<string> | null,
      price?: null,
      oldTimestamp?: null,
      newTimestamp?: null
    ): AnchorPriceUpdatedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "TokenConfigAdded(address,address,uint256)"(
      vToken?: PromiseOrValue<string> | null,
      pancakePool?: PromiseOrValue<string> | null,
      anchorPeriod?: PromiseOrValue<BigNumberish> | null
    ): TokenConfigAddedEventFilter;
    TokenConfigAdded(
      vToken?: PromiseOrValue<string> | null,
      pancakePool?: PromiseOrValue<string> | null,
      anchorPeriod?: PromiseOrValue<BigNumberish> | null
    ): TokenConfigAddedEventFilter;

    "TwapWindowUpdated(address,uint256,uint256,uint256,uint256)"(
      vToken?: PromiseOrValue<string> | null,
      oldTimestamp?: null,
      oldAcc?: null,
      newTimestamp?: null,
      newAcc?: null
    ): TwapWindowUpdatedEventFilter;
    TwapWindowUpdated(
      vToken?: PromiseOrValue<string> | null,
      oldTimestamp?: null,
      oldAcc?: null,
      newTimestamp?: null,
      newAcc?: null
    ): TwapWindowUpdatedEventFilter;

    "ValidateConfigAdded(address,uint256,uint256)"(
      vToken?: PromiseOrValue<string> | null,
      upperBound?: PromiseOrValue<BigNumberish> | null,
      lowerBound?: PromiseOrValue<BigNumberish> | null
    ): ValidateConfigAddedEventFilter;
    ValidateConfigAdded(
      vToken?: PromiseOrValue<string> | null,
      upperBound?: PromiseOrValue<BigNumberish> | null,
      lowerBound?: PromiseOrValue<BigNumberish> | null
    ): ValidateConfigAddedEventFilter;
  };

  estimateGas: {
    VBNB(overrides?: CallOverrides): Promise<BigNumber>;

    bnbBaseUnit(overrides?: CallOverrides): Promise<BigNumber>;

    busdBaseUnit(overrides?: CallOverrides): Promise<BigNumber>;

    currentCumulativePrice(
      config: TokenConfigStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    expScale(overrides?: CallOverrides): Promise<BigNumber>;

    getUnderlyingPrice(
      vToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    newObservations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    oldObservations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    prices(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTokenConfig(
      config: TokenConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTokenConfigs(
      configs: TokenConfigStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setValidateConfig(
      config: ValidateConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setValidateConfigs(
      configs: ValidateConfigStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    tokenConfigs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateTwap(
      vToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    validateConfigs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    validatePrice(
      vToken: PromiseOrValue<string>,
      reporterPrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    VBNB(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bnbBaseUnit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    busdBaseUnit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currentCumulativePrice(
      config: TokenConfigStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    expScale(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getUnderlyingPrice(
      vToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    newObservations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    oldObservations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    prices(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTokenConfig(
      config: TokenConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTokenConfigs(
      configs: TokenConfigStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setValidateConfig(
      config: ValidateConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setValidateConfigs(
      configs: ValidateConfigStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    tokenConfigs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateTwap(
      vToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    validateConfigs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    validatePrice(
      vToken: PromiseOrValue<string>,
      reporterPrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
