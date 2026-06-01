/**
 * 表格组件 - 光宽质差感知自智平台
 * 用于所有列表页面的表格展示
 */

// 组件样式
const tableComponentStyles = `
/* 表格包装器 */
.table-wrapper {
    overflow-x: auto;
    position: relative;
    border-radius: 8px;
}

.table-wrapper::-webkit-scrollbar {
    height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
    background: rgba(17, 24, 39, 0.5);
    border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.3);
    border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
    background: rgba(56, 189, 248, 0.5);
}

/* 表格样式 */
.data-table {
    min-width: 100%;
    border-collapse: collapse;
}

/* 表头行 */
.data-table thead tr {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
}

/* 表体行 */
.data-table tbody tr {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    transition: all 0.2s ease;
}

.data-table tbody tr:hover {
    background: rgba(56, 189, 248, 0.04);
    border-color: rgba(56, 189, 248, 0.2);
}

.data-table tbody tr:hover td {
    color: var(--text-primary);
}

/* 表头单元格 */
.data-table th {
    display: flex;
    align-items: center;
    padding: 14px 12px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    background: rgba(17, 24, 39, 0.8);
    flex-shrink: 0;
    height: 56px;
}

/* 表格单元格 */
.data-table td {
    display: flex;
    align-items: center;
    padding: 14px 12px;
    font-size: 13px;
    color: #cbd5e1;
    flex-shrink: 0;
    height: 56px;
}

/* 分页包装器 */
.pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
}

/* 分页信息 */
.pagination-info {
    font-size: 13px;
    color: var(--text-muted);
}

/* 分页按钮容器 */
.pagination {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* 分页按钮 */
.page-btn {
    min-width: 34px;
    height: 34px;
    padding: 0 10px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: transparent;
    color: var(--text-secondary);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.page-btn:hover:not(:disabled) {
    border-color: var(--accent-cyan);
    background: rgba(56, 189, 248, 0.1);
    color: var(--accent-cyan);
}

.page-btn.active {
    background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
    border: none;
    color: #fff;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-btn svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
}

/* 操作链接 */
.action-links {
    display: flex;
    gap: 12px;
}

.action-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: rgba(56, 189, 248, 0.1);
    color: var(--accent-cyan);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: rgba(56, 189, 248, 0.2);
    transform: scale(1.05);
}

.action-btn svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
}
`;

// 注入样式
const styleSheet = document.createElement('style');
styleSheet.textContent = tableComponentStyles;
document.head.appendChild(styleSheet);

class DataTable {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            minWidth: options.minWidth || 1200,
            showCheckbox: options.showCheckbox || false,
            pageSize: options.pageSize || 5,  // 默认每页5条数据
            currentPage: 1,
            onRowClick: options.onRowClick || null,
            ...options
        };
        this.columns = options.columns || [];
        this.data = options.data || [];
        this.totalPages = Math.ceil(this.data.length / this.options.pageSize) || 1;
    }

    // 渲染表格
    render() {
        // 计算当前页的数据
        const start = (this.options.currentPage - 1) * this.options.pageSize;
        const end = start + this.options.pageSize;
        const pageData = this.data.slice(start, end);

        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        wrapper.style.cssText = `overflow-x: auto; max-height: 100%;`;

        const table = document.createElement('table');
        table.className = 'data-table';
        table.style.cssText = `min-width: ${this.options.minWidth}px; width: 100%; border-collapse: collapse;`;

        table.innerHTML = `
            <thead>
                <tr>
                    ${this.options.showCheckbox ? '<th style="flex: 0.5;"><input type="checkbox" class="table-checkbox"></th>' : ''}
                    ${this.columns.map((col) => `
                        <th style="${col.flex ? `flex: ${col.flex};` : ''} ${col.justify ? `justify-content: ${col.justify};` : ''} ${col.minWidth ? `min-width: ${col.minWidth}px;` : ''}">
                            ${col.label}
                        </th>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
                ${pageData.map((row, rowIndex) => `
                    <tr data-index="${start + rowIndex}" ${this.options.onRowClick ? 'style="cursor: pointer;"' : ''}>
                        ${this.options.showCheckbox ? `<td style="flex: 0.5;"><input type="checkbox" class="row-checkbox"></td>` : ''}
                        ${this.columns.map((col) => `
                            <td style="${col.flex ? `flex: ${col.flex};` : ''} ${col.justify ? `justify-content: ${col.justify};` : ''}">
                                ${col.render ? col.render(row[col.key], row) : (row[col.key] || '')}
                            </td>
                        `).join('')}
                    </tr>
                `).join('')}
            </tbody>
        `;

        wrapper.appendChild(table);
        this.container.innerHTML = '';
        this.container.appendChild(wrapper);

        // 添加分页控件
        this.renderPagination();

        this.bindEvents();
        return this;
    }

    // 渲染分页控件
    renderPagination() {
        // 移除已有的分页控件
        const existingPagination = this.container.querySelector('.pagination-wrapper');
        if (existingPagination) {
            existingPagination.remove();
        }

        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = 'pagination-wrapper';
        paginationWrapper.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-top: 16px;';

        // 显示信息
        const info = document.createElement('span');
        info.style.cssText = 'font-size: 13px; color: var(--text-muted);';
        info.textContent = `显示 ${(this.options.currentPage - 1) * this.options.pageSize + 1}-${Math.min(this.options.currentPage * this.options.pageSize, this.data.length)} / 共 ${this.data.length} 条`;

        // 分页按钮容器
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';
        paginationDiv.innerHTML = this.generatePaginationHTML();

        paginationWrapper.appendChild(info);
        paginationWrapper.appendChild(paginationDiv);

        this.container.appendChild(paginationWrapper);

        // 绑定分页事件
        this.bindPaginationEvents();
    }

    // 生成分页HTML
    generatePaginationHTML() {
        const { currentPage, pageSize } = this.options;
        const totalPages = this.totalPages;

        let html = `
            <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-action="prev">
                <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
        `;

        // 页码按钮
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<span style="color: var(--text-muted); padding: 0 8px;">...</span>`;
            }
        }

        html += `
            <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-action="next">
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
        `;

        return html;
    }

    // 绑定分页事件
    bindPaginationEvents() {
        const paginationDiv = this.container.querySelector('.pagination');
        if (!paginationDiv) return;

        paginationDiv.addEventListener('click', (e) => {
            const btn = e.target.closest('.page-btn');
            if (!btn || btn.disabled) return;

            if (btn.dataset.action === 'prev') {
                this.options.currentPage--;
            } else if (btn.dataset.action === 'next') {
                this.options.currentPage++;
            } else if (btn.dataset.page) {
                this.options.currentPage = parseInt(btn.dataset.page);
            }

            this.render();
        });
    }

    // 绑定事件
    bindEvents() {
        // 行点击事件
        if (this.options.onRowClick) {
            this.container.querySelectorAll('tbody tr').forEach(row => {
                row.addEventListener('click', (e) => {
                    if (e.target.type !== 'checkbox') {
                        this.options.onRowClick(this.data[row.dataset.index], row.dataset.index);
                    }
                });
            });
        }

        // 全选/取消全选
        const headerCheckbox = this.container.querySelector('.table-checkbox');
        if (headerCheckbox) {
            headerCheckbox.addEventListener('change', (e) => {
                const checked = e.target.checked;
                this.container.querySelectorAll('.row-checkbox').forEach(cb => {
                    cb.checked = checked;
                });
            });
        }
    }

    // 更新数据
    updateData(newData) {
        this.data = newData;
        this.options.currentPage = 1;  // 重置到第一页
        this.totalPages = Math.ceil(this.data.length / this.options.pageSize) || 1;
        this.render();
    }

    // 获取选中的行
    getSelectedRows() {
        const selected = [];
        this.container.querySelectorAll('.row-checkbox:checked').forEach(cb => {
            const row = cb.closest('tr');
            selected.push(this.data[row.dataset.index]);
        });
        return selected;
    }

    // 设置每页显示条数
    setPageSize(size) {
        this.options.pageSize = size;
        this.options.currentPage = 1;
        this.totalPages = Math.ceil(this.data.length / size) || 1;
        this.render();
    }

    // 跳转到指定页
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.options.currentPage = page;
            this.render();
        }
    }

    // 获取当前页码
    getCurrentPage() {
        return this.options.currentPage;
    }

    // 获取总页数
    getTotalPages() {
        return this.totalPages;
    }
}

// 导出分页组件
class Pagination {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            currentPage: options.currentPage || 1,
            totalPages: options.totalPages || 1,
            onPageChange: options.onPageChange || (() => {}),
            ...options
        };
    }

    render() {
        const { currentPage, totalPages, onPageChange } = this.options;

        let html = `
            <div class="pagination">
                <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
        `;

        // 页码按钮
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<span class="page-ellipsis">...</span>`;
            }
        }

        html += `
                <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
            </div>
        `;

        this.container.innerHTML = html;
        this.bindEvents();
    }

    bindEvents() {
        this.container.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    this.options.currentPage = parseInt(btn.dataset.page);
                    this.options.onPageChange(this.options.currentPage);
                    this.render();
                }
            });
        });
    }

    setTotalPages(total) {
        this.options.totalPages = total;
        this.render();
    }
}

// 搜索栏组件
class SearchBar {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            fields: options.fields || [],
            onSearch: options.onSearch || (() => {}),
            onReset: options.onReset || (() => {}),
            ...options
        };
    }

    render() {
        this.container.className = 'search-bar';

        let html = this.options.fields.map(field => {
            if (field.type === 'select') {
                return `
                    <div class="search-input ${field.class || ''}">
                        <select data-field="${field.key}" style="
                            width: 100%;
                            background: transparent;
                            border: none;
                            outline: none;
                            color: var(--text-primary);
                            font-size: 13px;
                            cursor: pointer;
                            appearance: none;
                        ">
                            ${field.options.map(opt => `
                                <option value="${opt.value}">${opt.label}</option>
                            `).join('')}
                        </select>
                    </div>
                `;
            }
            return `
                <div class="search-input ${field.class || ''}">
                    <input type="text"
                           placeholder="${field.placeholder || field.label}"
                           data-field="${field.key}"
                           ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}>
                </div>
            `;
        }).join('');

        html += `
            <button class="btn-search">
                <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                搜索
            </button>
            <button class="btn-reset">重置</button>
        `;

        this.container.innerHTML = html;
        this.bindEvents();
    }

    bindEvents() {
        this.container.querySelector('.btn-search')?.addEventListener('click', () => {
            this.triggerSearch();
        });

        this.container.querySelector('.btn-reset')?.addEventListener('click', () => {
            this.container.querySelectorAll('input').forEach(input => input.value = '');
            this.container.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
            this.options.onReset();
        });

        // 回车搜索
        this.container.querySelectorAll('input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.triggerSearch();
            });
        });
    }

    triggerSearch() {
        const values = {};
        this.container.querySelectorAll('input, select').forEach(el => {
            values[el.dataset.field] = el.value;
        });
        this.options.onSearch(values);
    }

    getValues() {
        const values = {};
        this.container.querySelectorAll('input, select').forEach(el => {
            values[el.dataset.field] = el.value;
        });
        return values;
    }

    reset() {
        this.container.querySelectorAll('input').forEach(input => input.value = '');
        this.container.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    }
}

// 统计卡片组件
class StatCard {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = options;
    }

    render() {
        const { icon, label, value, color, bgColor } = this.options;

        this.container.innerHTML = `
            <div class="stat-card" style="
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 14px;
                padding: 20px;
                position: relative;
                overflow: hidden;
                transition: all 0.3s;
            ">
                <div class="stat-icon" style="
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: ${bgColor || 'rgba(56, 189, 248, 0.15)'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                ">
                    ${icon}
                </div>
                <div class="stat-value" style="
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--text-primary);
                    font-family: 'JetBrains Mono', monospace;
                    margin-bottom: 4px;
                ">${value}</div>
                <div class="stat-label" style="
                    font-size: 13px;
                    color: var(--text-muted);
                ">${label}</div>
            </div>
        `;
    }
}

// 导出组件
window.DataTable = DataTable;
window.Pagination = Pagination;
window.SearchBar = SearchBar;
window.StatCard = StatCard;
