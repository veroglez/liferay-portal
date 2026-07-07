/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import {ClaySelect} from '@clayui/form';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal from '@clayui/modal';
import {dateUtils, sub} from 'frontend-js-web';
import React, {useEffect, useRef, useState} from 'react';

import '../../../css/components/CompareVersionsModal.scss';
import StatusLabel from '../../common/components/StatusLabel';
import ApiHelper from '../../common/services/ApiHelper';
import {IAssetObjectEntry} from '../../common/types/AssetType';
import VersionService from '../info_panel/services/VersionService';
import {VIEW_CONTENT_VERSION_URL} from '../info_panel/util/constants';

interface CompareVersionsModalContentProps {
	apiURL: string;
	initialVersion: number;
	objectEntryId: number;
}

type DiffType = 'additions' | 'removals';

type Diffs = Record<string, string>;

type VersionItem = IAssetObjectEntry;

type VersionsState =
	| {status: 'error' | 'loading'}
	| {items: VersionItem[]; status: 'loaded'};

const BASE_DIFF_STYLES = `
	.form-group:has(.cms-compare-versions-diff) .ck-editor {
		display: none;
	}
	.cms-compare-versions-diff {
		background-color: #fff;
		border: 1px solid #e7e7ed;
		border-radius: 4px;
		min-height: 200px;
		padding: 12px 16px;
	}
	.cms-compare-versions-diff .diff-html-changed {
		border-bottom: 2px dotted blue;
	}
`;

const DIFF_HTML_URL = '/o/cms/diff_html';

const DIFF_STYLES_BY_TYPE: Record<DiffType, string> = {
	additions: `
		.cms-compare-versions-diff .diff-html-removed {
			display: none;
		}
		.cms-compare-versions-diff .diff-html-added {
			background-color: #cfc;
		}
	`,
	removals: `
		.cms-compare-versions-diff .diff-html-added {
			display: none;
		}
		.cms-compare-versions-diff .diff-html-removed {
			background-color: #fdc6c6;
			text-decoration: line-through;
		}
	`,
};

const getVersionLabel = (version: number) =>
	sub(Liferay.Language.get('version-x'), [version]);

function getIframeLiferay(iframe: HTMLIFrameElement | null) {
	const contentWindow = iframe?.contentWindow as
		| (Window & {Liferay: typeof Liferay})
		| null
		| undefined;

	return contentWindow?.Liferay;
}

function getVersionItem(items: VersionItem[], version: number) {
	return items.find(
		(item) => item.systemProperties.version.number === version
	);
}

function injectContentDiffs(
	iframe: HTMLIFrameElement,
	diffs: Diffs | null,
	diffType: DiffType
) {
	const document = iframe.contentDocument;

	if (!document) {
		return;
	}

	document
		.querySelectorAll('.cms-compare-versions-diff')
		.forEach((element) => element.remove());

	let style = document.getElementById('cms-compare-versions-diff-styles');

	if (diffs === null) {
		style?.remove();

		return;
	}

	Object.entries(diffs).forEach(([fieldName, diffHtml]) => {
		const wrapper = document.querySelector(
			`[data-field-name="ObjectField_${fieldName}"]`
		);

		if (!wrapper) {
			return;
		}

		const container = document.createElement('div');

		container.className = 'cms-compare-versions-diff';
		container.innerHTML = diffHtml;

		const formGroup = wrapper.querySelector('.form-group') ?? wrapper;

		formGroup.appendChild(container);
	});

	if (!style) {
		style = document.createElement('style');

		style.id = 'cms-compare-versions-diff-styles';

		document.head.appendChild(style);
	}

	style.textContent = BASE_DIFF_STYLES + DIFF_STYLES_BY_TYPE[diffType];
}

export default function CompareVersionsModalContent({
	apiURL,
	initialVersion,
	objectEntryId,
}: CompareVersionsModalContentProps) {
	const [diffs, setDiffs] = useState<Diffs | null>(null);
	const [languageId, setLanguageId] = useState<string>(
		Liferay.ThemeDisplay.getLanguageId()
	);
	const [leftVersion, setLeftVersion] = useState<number | null>(null);
	const [rightVersion, setRightVersion] = useState<number | null>(null);
	const [versionsState, setVersionsState] = useState<VersionsState>({
		status: 'loading',
	});

	useEffect(() => {
		const getVersions = async () => {
			const {data, error} = await VersionService.getObjectEntryVersions(
				apiURL,
				{page: 1, pageSize: -1, sort: 'version:desc'}
			);

			if (error !== null) {
				setVersionsState({status: 'error'});

				return;
			}

			const items: VersionItem[] = data.items;

			const latestVersion = items[0].systemProperties.version.number;

			setLeftVersion(
				initialVersion === latestVersion
					? items[1]?.systemProperties.version.number ?? latestVersion
					: initialVersion
			);
			setRightVersion(latestVersion);
			setVersionsState({items, status: 'loaded'});
		};

		getVersions();
	}, [apiURL, initialVersion]);

	useEffect(() => {
		if (
			versionsState.status !== 'loaded' ||
			leftVersion === null ||
			rightVersion === null ||
			leftVersion === rightVersion
		) {
			setDiffs(null);

			return;
		}

		let stale = false;

		const getDiffs = async () => {
			const {data, error} = await ApiHelper.post<{diffs: Diffs}>(
				DIFF_HTML_URL,
				{
					languageId,
					objectEntryId,
					sourceVersion: leftVersion,
					targetVersion: rightVersion,
				}
			);

			if (!stale) {
				setDiffs(error === null ? data.diffs : null);
			}
		};

		getDiffs();

		return () => {
			stale = true;
		};
	}, [languageId, leftVersion, objectEntryId, rightVersion, versionsState]);

	return (
		<>
			<ClayModal.Header
				closeButtonAriaLabel={Liferay.Language.get('close')}
			>
				{Liferay.Language.get('compare-versions')}
			</ClayModal.Header>

			<ClayModal.Body className="cms-compare-versions-modal-body">
				{versionsState.status === 'loading' ? (
					<ClayLoadingIndicator className="my-5" />
				) : null}

				{versionsState.status === 'error' ? (
					<ClayAlert className="m-3" displayType="danger">
						{Liferay.Language.get('an-unexpected-error-occurred')}
					</ClayAlert>
				) : null}

				{versionsState.status === 'loaded' &&
				leftVersion !== null &&
				rightVersion !== null ? (
					<div className="cms-compare-versions-panes">
						<CompareVersionPane
							diffs={diffs}
							diffType="removals"
							languageId={languageId}
							objectEntryId={objectEntryId}
							onLanguageIdChange={setLanguageId}
							onVersionChange={setLeftVersion}
							selectedVersion={leftVersion}
							versions={versionsState.items}
						/>

						<CompareVersionPane
							diffs={diffs}
							diffType="additions"
							languageId={languageId}
							objectEntryId={objectEntryId}
							onLanguageIdChange={setLanguageId}
							onVersionChange={setRightVersion}
							selectedVersion={rightVersion}
							versions={versionsState.items}
						/>
					</div>
				) : null}
			</ClayModal.Body>
		</>
	);
}

function CompareVersionPane({
	diffs,
	diffType,
	languageId,
	objectEntryId,
	onLanguageIdChange,
	onVersionChange,
	selectedVersion,
	versions,
}: {
	diffs: Diffs | null;
	diffType: DiffType;
	languageId: string;
	objectEntryId: number;
	onLanguageIdChange: (languageId: string) => void;
	onVersionChange: (version: number) => void;
	selectedVersion: number;
	versions: VersionItem[];
}) {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const [iframeStatus, setIframeStatus] = useState<'loaded' | 'loading'>(
		'loading'
	);

	useEffect(() => {
		if (iframeStatus === 'loaded' && iframeRef.current) {
			injectContentDiffs(iframeRef.current, diffs, diffType);
		}
	}, [diffs, diffType, iframeStatus]);

	useEffect(() => {
		if (iframeStatus !== 'loaded') {
			return;
		}

		const iframeLiferay = getIframeLiferay(iframeRef.current);

		if (!iframeLiferay) {
			return;
		}

		const handleLocaleChanged = ({
			languageId: newLanguageId,
		}: {
			languageId: string;
		}) => onLanguageIdChange(newLanguageId);

		iframeLiferay.on(
			'localizationSelect:localeChanged',
			handleLocaleChanged
		);

		return () =>
			iframeLiferay.detach(
				'localizationSelect:localeChanged',
				handleLocaleChanged
			);
	}, [iframeStatus, onLanguageIdChange]);

	useEffect(() => {
		if (iframeStatus !== 'loaded') {
			return;
		}

		const iframeLiferay = getIframeLiferay(iframeRef.current);

		iframeLiferay?.fire('localizationSelect:localeChanged', {languageId});
	}, [iframeStatus, languageId]);

	const selectedItem = getVersionItem(versions, selectedVersion);

	return (
		<div className="cms-compare-versions-pane">
			<div className="align-items-center c-gap-3 d-flex p-3">
				<ClaySelect
					aria-label={Liferay.Language.get('version')}
					className="w-auto"
					onChange={(event) => {
						setIframeStatus('loading');
						onVersionChange(Number(event.target.value));
					}}
					value={selectedVersion}
				>
					{versions.map((item) => (
						<ClaySelect.Option
							key={item.systemProperties.version.number}
							label={getVersionLabel(
								item.systemProperties.version.number
							)}
							value={item.systemProperties.version.number}
						/>
					))}
				</ClaySelect>

				{selectedItem ? (
					<>
						<span className="text-secondary text-truncate">
							{sub(Liferay.Language.get('modified-by-x'), [
								selectedItem.creator.name,
							])}

							{` ${dateUtils.format(
								new Date(selectedItem.dateModified),
								'P p'
							)}`}
						</span>

						<StatusLabel label={selectedItem.status.label} />
					</>
				) : null}
			</div>

			<div className="cms-compare-versions-pane-content">
				{iframeStatus === 'loading' ? (
					<ClayLoadingIndicator className="my-5" />
				) : null}

				<iframe
					onLoad={() => setIframeStatus('loaded')}
					ref={iframeRef}
					src={`${VIEW_CONTENT_VERSION_URL}/edit_content_item?objectEntryId=${objectEntryId}&p_l_mode=read&p_p_state=pop_up&version=${selectedVersion}`}
					title={getVersionLabel(selectedVersion)}
				/>
			</div>
		</div>
	);
}
