package com.mymosque.backend.repository;

import com.mymosque.backend.model.Mosque;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MosqueRepository extends JpaRepository<Mosque, Long> {
}
