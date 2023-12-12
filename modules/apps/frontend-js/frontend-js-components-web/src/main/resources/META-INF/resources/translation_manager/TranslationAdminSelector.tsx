/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import ClayLayout from '@clayui/layout';
import {sub} from 'frontend-js-web';
import React, {useEffect, useMemo, useState} from 'react';

import {Locale, Translations} from './TranslationAdminContent';
import TranslationAdminModal from './TranslationAdminModal';
import TranslationAdminStatusLabel from './TranslationAdminStatusLabel';
export interface TranslationProgress {
	totalItems: number;
	translatedItems: Record<string, number>;
}
interface IProps extends Translations {
	adminMode?: boolean;
	horizontalDisplay?: boolean;
	onActiveLanguageIdsChange?: (
		languageIds: Liferay.Language.Locale[]
	) => void;
	onSelectedLanguageIdChange?: (languageId: Liferay.Language.Locale) => void;
	selectedLanguageId: Liferay.Language.Locale;
	showOnlyFlags?: boolean;
	small?: boolean;
	translationProgress?: TranslationProgress | null;
}

// These variables are defined here, out of the component, to avoid
// unexpected re-renders

const noop = () => {};

export default function TranslationAdminSelector({
	activeLanguageIds: initialActiveLanguageIds = [],
	adminMode,
	ariaLabels = {
		default: Liferay.Language.get('default'),
		manageTranslations: Liferay.Language.get('manage-translations'),
		notTranslated: Liferay.Language.get('not-translated'),
		translated: Liferay.Language.get('translated'),
	},
	availableLocales = [],
	defaultLanguageId,
	horizontalDisplay = false,
	onActiveLanguageIdsChange = noop,
	onSelectedLanguageIdChange = noop,
	selectedLanguageId: initialSelectedLanguageId,
	showOnlyFlags,
	small = false,
	translations = null,
	translationProgress = null,
}: IProps) {
	const [activeLanguageIds, setActiveLanguageIds] = useState<
		Liferay.Language.Locale[]
	>(initialActiveLanguageIds);
	const [selectedLanguageId, setSelectedLanguageId] = useState<
		Liferay.Language.Locale
	>(initialSelectedLanguageId);
	const [selectorDropdownActive, setSelectorDropdownActive] = useState(false);
	const [translationModalVisible, setTranslationModalVisible] = useState(
		false
	);

	const handleCloseTranslationModal = (
		activeLanguageIds: Liferay.Language.Locale[]
	) => {
		setActiveLanguageIds(activeLanguageIds);

		if (!activeLanguageIds.includes(selectedLanguageId)) {
			setSelectedLanguageId(defaultLanguageId);
		}

		setTranslationModalVisible(false);
	};

	const activeLocales = useMemo(
		() =>
			availableLocales.filter((availableLocale) =>
				activeLanguageIds.includes(availableLocale.id)
			),
		[availableLocales, activeLanguageIds]
	);

	const selectedLocale = useMemo(() => {
		const id = selectedLanguageId ?? defaultLanguageId;

		return availableLocales.find(
			(availableLocale) => availableLocale.id === id
		) as Locale;
	}, [availableLocales, defaultLanguageId, selectedLanguageId]);

	useEffect(() => {
		onActiveLanguageIdsChange(activeLanguageIds);
	}, [activeLanguageIds, onActiveLanguageIdsChange]);

	useEffect(() => {
		onSelectedLanguageIdChange(selectedLanguageId);
	}, [selectedLanguageId, onSelectedLanguageIdChange]);

	useEffect(() => {
		setActiveLanguageIds(initialActiveLanguageIds);
	}, [initialActiveLanguageIds]);

	useEffect(() => {
		setSelectedLanguageId(initialSelectedLanguageId);
	}, [initialSelectedLanguageId]);

	const ariaLabelButton = sub(
		Liferay.Language.get('select-a-language.-current-language-x'),
		selectedLocale.displayName
	);

	return (
		<>
			<TranslationAdminModal
				activeLanguageIds={activeLanguageIds}
				ariaLabels={ariaLabels}
				availableLocales={availableLocales}
				defaultLanguageId={defaultLanguageId}
				onClose={handleCloseTranslationModal}
				translations={translations}
				visible={translationModalVisible}
			/>

			<ClayDropDown
				active={selectorDropdownActive}
				onActiveChange={setSelectorDropdownActive}
				trigger={
					Liferay.FeatureFlags['LPS-114700'] && horizontalDisplay ? (
						<ClayButton
							aria-label={ariaLabelButton}
							className="btn-block form-control-select"
							displayType="secondary"
							size="sm"
						>
							<span className="inline-item-before">
								<ClayIcon symbol={selectedLocale.symbol} />
							</span>

							<span aria-hidden="true">
								{selectedLocale.label}
							</span>
						</ClayButton>
					) : (
						<ClayButton
							aria-label={ariaLabelButton}
							displayType="secondary"
							monospaced
							small={small}
							title={Liferay.Language.get('select-language')}
						>
							<span className="inline-item">
								<ClayIcon symbol={selectedLocale.symbol} />
							</span>

							<span aria-hidden="true" className="btn-section">
								{selectedLocale.label}
							</span>
						</ClayButton>
					)
				}
			>
				<ClayDropDown.ItemList>
					{activeLocales.map(({displayName, id, label, symbol}) => {
						return (
							<ClayDropDown.Item
								key={id}
								onClick={() => {
									setSelectedLanguageId(id);
									setSelectorDropdownActive(false);
								}}
							>
								<ClayLayout.ContentRow containerElement="span">
									<ClayLayout.ContentCol
										containerElement="span"
										expand
									>
										<ClayLayout.ContentSection>
											<ClayIcon
												className="inline-item inline-item-before"
												symbol={symbol}
											/>

											<span aria-hidden="true">
												{label}
											</span>
										</ClayLayout.ContentSection>
									</ClayLayout.ContentCol>

									{!showOnlyFlags && (
										<TranslationAdminStatusLabel
											defaultLanguageId={
												defaultLanguageId
											}
											labels={{
												default: ariaLabels.default!,
												notTranslated: ariaLabels.notTranslated!,
												translated: ariaLabels.translated!,
											}}
											languageId={id}
											languageName={displayName}
											localeValue={
												translations
													? translations[id]
													: null
											}
											translationProgress={
												translationProgress
											}
										/>
									)}
								</ClayLayout.ContentRow>
							</ClayDropDown.Item>
						);
					})}

					{adminMode && (
						<>
							<ClayDropDown.Divider />
							<ClayDropDown.Item
								data-testid="translation-modal-trigger"
								onClick={() => setTranslationModalVisible(true)}
							>
								<ClayLayout.ContentRow containerElement="span">
									<ClayLayout.ContentCol
										containerElement="span"
										expand
									>
										<ClayLayout.ContentSection>
											<ClayIcon
												className="inline-item inline-item-before"
												symbol="automatic-translate"
											/>

											{ariaLabels.manageTranslations}
										</ClayLayout.ContentSection>
									</ClayLayout.ContentCol>
								</ClayLayout.ContentRow>
							</ClayDropDown.Item>
						</>
					)}
				</ClayDropDown.ItemList>
			</ClayDropDown>
		</>
	);
}
