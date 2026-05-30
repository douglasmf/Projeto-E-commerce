{
    (createModalOpen ||
        editModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-zinc-900">
                        {createModalOpen
                            ? 'Novo Produto'
                            : 'Editar Produto'}
                    </h2>
                    <div className="mt-3 h-1 w-24 rounded-full bg-zinc-800" />
                </div>
                <div className="flex flex-col gap-5">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-zinc-700">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={
                                formData.name
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name:
                                        e.target
                                            .value,
                                })
                            }
                            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-zinc-700">
                            Preço
                        </label>
                        <input
                            type="number"
                            value={
                                formData.price
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    price:
                                        e.target
                                            .value,
                                })
                            }
                            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-zinc-700">
                            Desconto
                        </label>
                        <input
                            type="number"
                            value={
                                formData.discount
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    discount:
                                        e.target
                                            .value,
                                })
                            }
                            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-zinc-700">
                            Estoque
                        </label>
                        <input
                            type="number"
                            value={
                                formData.stock
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    stock:
                                        e.target
                                            .value,
                                })
                            }
                            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-zinc-700">
                            Categoria
                        </label>
                        <select
                            value={
                                formData.categoryId
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    categoryId:
                                        e.target
                                            .value,
                                })
                            }
                            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                        >
                            <option value="">
                                Selecione
                            </option>
                            {categories.map(
                                (category) => (
                                    <option
                                        key={
                                            category.id
                                        }
                                        value={
                                            category.id
                                        }
                                    >
                                        {
                                            category.name
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-zinc-700">
                            Imagem (URL)
                        </label>
                        <input
                            type="text"
                            placeholder="https://exemplo.com/imagem.jpg"
                            value={
                                formData.image
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    image:
                                        e.target
                                            .value,
                                })
                            }
                            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                        />
                    </div>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        onClick={() => {
                            setCreateModalOpen(
                                false,
                            );
                            setEditModalOpen(
                                false,
                            );
                        }}
                        className="rounded-xl bg-zinc-200 px-5 py-3 font-medium text-zinc-700 transition hover:bg-zinc-300 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={
                            createModalOpen
                                ? handleCreateProduct
                                : handleEditProduct
                        }
                        className="rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700 cursor-pointer"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    )
}
{
    deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-zinc-900">
                    Confirmar exclusão
                </h2>
                <div className="mt-3 h-1 w-24 rounded-full bg-red-600" />
                <p className="mt-6 text-zinc-600">
                    Deseja realmente deletar{' '}
                    <strong>
                        {
                            selectedProduct?.name
                        }
                    </strong>
                    ?
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        onClick={() =>
                            setDeleteModalOpen(
                                false,
                            )
                        }
                        className="rounded-xl bg-zinc-200 px-5 py-3 font-medium text-zinc-700 transition hover:bg-zinc-300 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={
                            handleDeleteProduct
                        }
                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 cursor-pointer"
                    >
                        Deletar
                    </button>
                </div>
            </div>
        </div>
    )
}
