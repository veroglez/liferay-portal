/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {Option, Picker} from '@clayui/core';
import ClayDropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import ClayLayout from '@clayui/layout';
import {useId} from 'frontend-js-components-web';
import {sub} from 'frontend-js-web';
import React, {useState} from 'react';

import StatusLabel from './StatusLabel';

const TriggerLabel = React.forwardRef(
	(
		{selectedItem, ...otherProps}: {selectedItem: Language},
		ref: React.LegacyRef<HTMLButtonElement>
	) => {
		return (
			<button
				{...otherProps}
				className="btn btn-block btn-secondary btn-sm form-control-select"
				ref={ref}
			>
				<span className="inline-item-before">
					<ClayIcon symbol={selectedItem.icon} />
				</span>

				<span aria-hidden="true">{selectedItem.label}</span>
			</button>
		);
	}
);

const Item = ({
	defaultLanguageId,
	item,
	totalTranslations,
}: {
	defaultLanguageId: Liferay.Language.Locale;
	item: Language;
	totalTranslations: number;
}) => {
	return (
		<ClayLayout.ContentRow containerElement="span">
			<ClayLayout.ContentCol containerElement="span" expand>
				<ClayLayout.ContentSection>
					<ClayIcon
						className="inline-item-before"
						symbol={item.icon}
					/>

					<span aria-hidden="true">{item.label}</span>
				</ClayLayout.ContentSection>
			</ClayLayout.ContentCol>

			<StatusLabel
				defaultLanguageId={defaultLanguageId}
				item={item}
				totalTranslations={totalTranslations}
			/>
		</ClayLayout.ContentRow>
	);
};

export interface Language {
	icon: string;
	id: Liferay.Language.Locale;
	label: Liferay.Language.Locale;
	translations: number;
}

export interface Translation {
	fieldName: string;
	languages: Liferay.Language.Locale[];
}

interface Props {

	/**
	 * Current default language
	 */
	defaultLanguageId: Liferay.Language.Locale;

	/**
	 * List of languages to allow localization for
	 */
	languages: Language[];

	/**
	 * Callback that gets called when a selected language gets changed
	 */
	onSelectedLanguageChange: (item: any) => void;

	/**
	 * Currently selected language
	 */
	selectedLanguageId: Liferay.Language.Locale;

	/**
	 * Show the manage tranlation button
	 */
	showManageTranslationButton?: boolean;

	/**
	 * Translations provided to the component to be used and modified by it
	 */
	translations: Translation[];
}

export default function TranslationSelector({
	defaultLanguageId,
	languages,
	onSelectedLanguageChange,
	selectedLanguageId,
	showManageTranslationButton = false,
	translations,
}: Props) {
	const [active, setActive] = useState<boolean>(false);
	const selectorId = useId();

	const getSelectedLanguage = (id: React.Key) =>
		languages.find((language) => language.id === id)!;

	const [selectedLanguage, setSelectedLanguage] = useState<Language>(
		getSelectedLanguage(selectedLanguageId)!
	);

	const items = languages.map((language) => ({
		...language,
		translations: translations.filter(({languages}) =>
			languages.includes(language.id)
		).length,
	}));

	0;
	const onSelectionChange = (key: React.Key) => {
		onSelectedLanguageChange(key);
		setSelectedLanguage(getSelectedLanguage(key));
	};

	return showManageTranslationButton ? (
		<ClayDropDown
			active={active}
			closeOnClickOutside
			filterKey="name"
			onActiveChange={setActive}
			trigger={
				<ClayButton
					className="btn-block form-control-select"
					displayType="secondary"
					size="sm"
				>
					<span className="inline-item-before">
						<ClayIcon symbol={selectedLanguage.icon} />
					</span>

					<span aria-hidden="true">{selectedLanguage.label}</span>
				</ClayButton>
			}
		>
			<ClayDropDown.ItemList items={items}>
				{(item: Language) => (
					<ClayDropDown.Item
						key={item.label}
						onClick={() => {
							setActive(false);
							onSelectionChange(item.id);
						}}
					>
						<Item
							defaultLanguageId={defaultLanguageId}
							item={item}
							totalTranslations={translations.length}
						/>
					</ClayDropDown.Item>
				)}
			</ClayDropDown.ItemList>
		</ClayDropDown>
	) : (
		<Picker
			aria-label={sub(
				Liferay.Language.get('select-a-language.-current-language-x'),
				selectedLanguage.label
			)}
			as={TriggerLabel}
			id={selectorId}
			items={items}
			onSelectionChange={onSelectionChange}
			selectedItem={selectedLanguage}
			selectedKey={selectedLanguage.id}
		>
			{(item) => (
				<Option key={item.id} textValue={item.label}>
					<Item
						defaultLanguageId={defaultLanguageId}
						item={item}
						totalTranslations={translations.length}
					/>
				</Option>
			)}
		</Picker>
	);
}
