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

type VersionItem = IAssetObjectEntry & {content?: string};

type VersionsState =
	| {status: 'error' | 'loading'}
	| {items: VersionItem[]; status: 'loaded'};

const BASE_DIFF_STYLES = `
	[data-field-name="ObjectField_content"] .ck-editor {
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

function getVersionItem(items: VersionItem[], version: number) {
	return items.find(
		(item) => item.systemProperties.version.number === version
	);
}

function injectContentDiff(
	iframe: HTMLIFrameElement,
	diffHtml: string | null,
	diffType: DiffType
) {
	const document = iframe.contentDocument;

	const wrapper = document?.querySelector(
		'[data-field-name="ObjectField_content"]'
	);

	if (!document || !wrapper) {
		return;
	}

	let container = wrapper.querySelector('.cms-compare-versions-diff');
	let style = document.getElementById('cms-compare-versions-diff-styles');

	if (diffHtml === null) {
		container?.remove();
		style?.remove();

		return;
	}

	if (!container) {
		container = document.createElement('div');

		container.className = 'cms-compare-versions-diff';

		const formGroup = wrapper.querySelector('.form-group') ?? wrapper;

		formGroup.appendChild(container);
	}

	container.innerHTML = diffHtml;

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
	const [diffHtml, setDiffHtml] = useState<string | null>(null);
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
			setDiffHtml(null);

			return;
		}

		let stale = false;

		const getDiffHtml = async () => {
			const {data, error} = await ApiHelper.post<{diffHtml: string}>(
				DIFF_HTML_URL,
				{
					source:
						getVersionItem(versionsState.items, leftVersion)
							?.content ?? '',
					target:
						getVersionItem(versionsState.items, rightVersion)
							?.content ?? '',
				}
			);

			if (!stale) {
				setDiffHtml(error === null ? data.diffHtml : null);
			}
		};

		getDiffHtml();

		return () => {
			stale = true;
		};
	}, [leftVersion, rightVersion, versionsState]);

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
							diffHtml={diffHtml}
							diffType="removals"
							objectEntryId={objectEntryId}
							onVersionChange={setLeftVersion}
							selectedVersion={leftVersion}
							versions={versionsState.items}
						/>

						<CompareVersionPane
							diffHtml={diffHtml}
							diffType="additions"
							objectEntryId={objectEntryId}
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
	diffHtml,
	diffType,
	objectEntryId,
	onVersionChange,
	selectedVersion,
	versions,
}: {
	diffHtml: string | null;
	diffType: DiffType;
	objectEntryId: number;
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
			injectContentDiff(iframeRef.current, diffHtml, diffType);
		}
	}, [diffHtml, diffType, iframeStatus]);

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
