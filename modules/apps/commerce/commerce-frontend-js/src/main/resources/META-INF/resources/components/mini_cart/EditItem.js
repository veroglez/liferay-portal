/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import ClayForm from '@clayui/form';
import {useLiferayState} from '@liferay/frontend-js-state-web';
import {fetch, sub} from 'frontend-js-web';
import React, {useContext, useEffect, useMemo, useState} from 'react';

import ServiceProvider from '../../ServiceProvider/index';
import {CommerceContext} from '../../index';
import skuOptionsAtom from '../../utilities/atoms/skuOptionsAtom';
import {CHANNEL_RESOURCE_ENDPOINT, FIELD_TYPE} from '../../utilities/constants';
import {
	CP_INSTANCE_CHANGED,
	CURRENT_ORDER_UPDATED,
} from '../../utilities/eventsDefinitions';
import {formatCartItem} from '../add_to_cart/data';
import {adaptLegacyPriceModel, isNonnull} from '../price/util/index';
import ProductOptionCheckbox from '../product_options/ProductOptionCheckbox';
import ProductOptionCheckboxMultiple from '../product_options/ProductOptionCheckboxMultiple';
import ProductOptionDate from '../product_options/ProductOptionDate';
import ProductOptionNumeric from '../product_options/ProductOptionNumeric';
import ProductOptionRadio from '../product_options/ProductOptionRadio';
import ProductOptionSelect from '../product_options/ProductOptionSelect';
import ProductOptionText from '../product_options/ProductOptionText';
import MiniCartContext from './MiniCartContext';

const CartResource = ServiceProvider.DeliveryCartAPI('v1');

const getProductOptions = (channelId, productId) => {
	const url = new URL(
		`${themeDisplay.getPathContext()}${CHANNEL_RESOURCE_ENDPOINT}/${channelId}/products/${productId}/product-options`,
		themeDisplay.getPortalURL()
	);

	return url.toString();
};

const saveItem = async ({cartState, cpInstance, namespace, selectedItem}) => {
	const {cartItems, id: cartId} = cartState;
	const {skuMiniCartOptions} = cpInstance;

	const formattedCartItem = formatCartItem(
		cpInstance,
		namespace,
		skuMiniCartOptions,
		namespace
	);

	const updatedCartItems = cartItems.map((cartItem) =>
		cartItem.id === selectedItem.id
			? {
					...cartItem,
					options: formattedCartItem.options,
					replacedSkuId: formattedCartItem.replacedSkuId,
					sku: cpInstance.sku,
					skuId: formattedCartItem.skuId,
			  }
			: cartItem
	);

	const updatedCart = await CartResource.updateCartById(cartId, {
		cartItems: updatedCartItems,
	});

	Liferay.fire(CURRENT_ORDER_UPDATED, {order: updatedCart});

	return updatedCart;
};

function EditItem() {
	const [options, setOptions] = useState([]);
	const [skuOptionsAtomState, setSkuOptionsAtomState] = useLiferayState(
		skuOptionsAtom
	);
	const [cpInstance, setCpInstance] = useState({});

	const {miniCartErrors, namespace} = skuOptionsAtomState;

	const buttonSaveIsDisabled = useMemo(() => miniCartErrors.length, [
		miniCartErrors,
	]);

	const {
		cartState: {
			cartItems,
			channel: {channel},
		},
		cartState,
		editedItem,
		setEditedItem,
	} = useContext(MiniCartContext);

	const backLabel = sub(
		Liferay.Language.get('go-to-x'),
		Liferay.Language.get('products')
	);

	const selectedItem = useMemo(
		() => cartItems.find((item) => item.productId === editedItem.productId),
		[cartItems, editedItem]
	);

	useEffect(() => {
		setCpInstance({
			quantity: selectedItem.quantity,
			replacedSkuId: selectedItem.replacedSkuId,
			skuId: selectedItem.skuId,
			skuMiniCartOptions: skuOptionsAtomState.skuMiniCartOptions,
		});
	}, [selectedItem, skuOptionsAtomState.skuMiniCartOptions]);

	const [price, setPrice] = useState(selectedItem.price);

	const updatePrice = ({cpInstance}) => {
		setCpInstance(cpInstance);
		setPrice(adaptLegacyPriceModel(cpInstance.price));
	};

	useEffect(() => {
		const url = getProductOptions(channel.id, editedItem.productId);

		fetch(url)
			.then((response) => response.json())
			.then((data) => setOptions(data))
			.catch((error) => console.error(error));
	}, [channel.id, editedItem.productId]);

	useEffect(() => {
		Liferay.on(`${namespace}${CP_INSTANCE_CHANGED}`, updatePrice);

		return () => {
			Liferay.detach(`${namespace}${CP_INSTANCE_CHANGED}`, updatePrice);
		};
	}, [namespace]);

	const hasDiscount = isNonnull(price.discountPercentage);
	const hasPromoPrice = isNonnull(price.promoPrice);

	const onSaveItem = () => {
		if (buttonSaveIsDisabled) {
			return;
		}

		saveItem({
			cartState,
			cpInstance,
			namespace,
			selectedItem,
		})
			.then(() => {
				setEditedItem(null);
				setSkuOptionsAtomState({
					...skuOptionsAtomState,
					skuOptions: skuOptionsAtomState.skuMiniCartOptions,
				});
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<>
			<div className="d-flex flex-column h-100 mini-cart-edit-item">
				<div className="align-items-center d-flex mini-cart-header px-4">
					<ClayButtonWithIcon
						aria-label={backLabel}
						displayType="unstyled"
						onClick={() => setEditedItem(null)}
						symbol="angle-left"
						title={backLabel}
					/>

					<span className="font-weight-bold ml-2 text-5">
						{editedItem.name}
					</span>
				</div>

				<div className="flex-grow-1 p-4">
					{options?.items?.length > 0 ? (
						<ClayForm>
							<Options
								channelId={channel.id}
								namespace={namespace}
								options={options.items}
								productId={editedItem.productId}
								selectedItem={selectedItem}
							/>
						</ClayForm>
					) : null}

					<div className="mini-cart-prices pt-2">
						<PriceRow
							priceName={Liferay.Language.get('price-list')}
						>
							<span className="price-line-through">
								{price.priceFormatted}
							</span>
						</PriceRow>

						{hasPromoPrice ? (
							<PriceRow
								priceName={Liferay.Language.get('promo-price')}
							>
								<span className="price-line-through">
									{price.promoPriceFormatted}
								</span>
							</PriceRow>
						) : null}

						{hasDiscount ? (
							<PriceRow
								priceName={Liferay.Language.get('discount')}
							>
								<span className="price-discount">
									{`-${price.discountPercentage}%`}
								</span>
							</PriceRow>
						) : null}

						<PriceRow
							priceName={Liferay.Language.get(
								'price-as-configurated'
							)}
						>
							<span className="text-7">
								{price.finalPriceFormatted}
							</span>
						</PriceRow>
					</div>
				</div>

				<div className="mini-cart-footer px-4 py-2 text-right">
					<ClayButton
						className="mr-3"
						displayType="secondary"
						onClick={() => setEditedItem(null)}
					>
						{Liferay.Language.get('cancel')}
					</ClayButton>

					<ClayButton
						disabled={buttonSaveIsDisabled}
						onClick={onSaveItem}
					>
						{Liferay.Language.get('save')}
					</ClayButton>
				</div>
			</div>
		</>
	);
}

export default EditItem;

const Options = ({channelId, namespace, options, productId, selectedItem}) =>
	options.map((option) => {
		let Component = ProductOptionText;
		let props = {
			componentId: `${namespace}_${option.id}`,
			isFromMiniCart: true,
			json: selectedItem.options,
			namespace,
			productOption: option,
		};

		if (option.fieldType === FIELD_TYPE.checkboxMultiple) {
			Component = ProductOptionCheckboxMultiple;
		}
		else if (option.fieldType === FIELD_TYPE.checkbox) {
			Component = ProductOptionCheckbox;
		}
		else if (option.fieldType === FIELD_TYPE.date) {
			Component = ProductOptionDate;
		}
		else if (option.fieldType === FIELD_TYPE.numeric) {
			Component = ProductOptionNumeric;
		}
		else if (option.fieldType === FIELD_TYPE.radio) {
			Component = ProductOptionRadio;
			props = {
				...props,
				accountId: CommerceContext.account.accountId,
				channelId,
				minQuantity: selectedItem.quantity,
				productId,
				sku: {skuId: selectedItem.skuId},
			};
		}
		else if (option.fieldType === FIELD_TYPE.select) {
			Component = ProductOptionSelect;
			props = {
				...props,
				accountId: CommerceContext.account.accountId,
				channelId,
				minQuantity: selectedItem.quantity,
				productId,
				sku: {skuId: selectedItem.skuId},
			};
		}

		return <Component key={option.id} {...props} />;
	});

const PriceRow = ({children, priceName}) => {
	return (
		<div className="align-items-baseline d-flex justify-content-between mb-2">
			<span className="text-2">{priceName}</span>

			{children}
		</div>
	);
};
